const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const database=require("./database")
const http=require('http');
const loadObject= require('./public/js/engine');
const { send } = require('process');
const gameFile='./vedioGame.json'
const production="https://git.heroku.com/damp-reaches-70694.com"
const development='http://localhost:8000/'
let url = (process.env.NODE_ENV ? production : development);

//MAIN PAGE ROUTES

//to include all assets (css files and images)
app.use(express.static(path.join(__dirname,'public')));

//add the router
app.use('/', router);

//Index page
router.get('/',function(req,res){
  //sends index.html to the client
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

router.get('/index',function(req,res){
  //redirects to above route
  res.redirect('/')
});

//collection page
router.get('/collection',function(req,res){
  //sends collection.html to the client
  res.sendFile(path.join(__dirname+'/public/collection.html'));
});

//explore page
router.get('/explore',function(req,res){
  //sends explore.html to the client
  res.sendFile(path.join(__dirname+'/public/explore.html'));
});

//DATA / DATABASE RELATED ROUTES

//This access database, 'pool' refers to a datapool (I'd imagine)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//Data for the collection.html
router.get('/thedata', async function(req, res) {
  /*
  const cArr = [
    {
        name: "NES",
        title: "NES",
        consoles: ["nes.webp", "nes-2.webp"],
        games: [
            ["mario-game.webp", "Super Mario Bros", "B"],
            ["mario-3-game.webp", "Super Mario Bros 3", "P"],
            ["mario-3-game.webp", "Super Mario Bros 3", "P"]
        ]
    },
    {
        name: "3ds",
        title: "New 3DS",
        consoles: ["3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG"],
        games: [
            ["ultra-sun.png", "Pokemon Ultra Sun", "B"],
            ["mario-3d-land.jpg", "Super Mario 3D Land", "P"]
        ]
    },
    {
        name: "gba",
        title: "Gameboy Advance",
        consoles: ["gba-sp.png"],
        games: [
            ["firered.png", "Pokemon FireRed", "P"],
            ["firered.png", "Pokemon FireRed", "P"]
        ]
    },
    {
        name: "n64",
        title: "n64",
        consoles: ["n64.webp"],
        games: [
            ["mario-64-game.webp", "Super Mario 64", "W"]
        ]
    }
  ];
  */
  //work in progress
  const client = await pool.connect();
  const result = await client.query(`SELECT * FROM userownconsole INNER JOIN consoles ON 
  userownconsole.cid = consoles.cid WHERE uid=1`);
  const results = (result) ? result.rows : null;

  let newArr = [
    {
      name: "3ds",
      title: "New 3DS",
      consoles: ["3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG"],
      games: [
          ["ultra-sun.png", "Pokemon Ultra Sun", "B"],
          ["mario-3d-land.jpg", "Super Mario 3D Land", "P"]
      ]
    },
    {
      name: "gba",
      title: "Gameboy Advance",
      consoles: ["gba-sp.png"],
      games: [
          ["firered.png", "Pokemon FireRed", "P"],
          ["firered.png", "Pokemon FireRed", "P"]
      ]
    }
  ];
  
  //An issue.
  //Takes the query and turn it into something like cArr
  results.forEach(x => {
    let index = newArr.findIndex(con => {
      return con.title === x.type;
    });
    
    //if there doesn't exist a console
    if (index === -1) {
      let obj = {
        name: x.type.replace(/\s/g, ''),
        title: x.type,
        consoles: [x.imgurl],
        games: []
      }
      newArr.push(obj);
    } else {
      // newArr[index].consoles.push(x.imgurl);
    }
  });

  res.send(JSON.stringify(newArr));
  client.release();
});

//This allows me to get the data from body easily
app.use(express.urlencoded({extended:true}));

//Signup database POST
app.post('/signup', async function(req,res) {
  //This gets the data from POST submit, usually was in form of:
  //website.com?uname='_'&pword='_'
  const { uname, pword } = req.body;

  //This connects to database
  const client = await pool.connect();

  //this creates the table if it does not exist.
  await client.query(`CREATE TABLE IF NOT EXISTS users (
    uid SERIAL,
    username VARCHAR(255),
    password VARCHAR(255),
    PRIMARY KEY(uid)
    );`);

  //This grabs all usernames that are the same as uname (Hopefully none)
  const getUser = await client.query(`SELECT username FROM users WHERE username='${uname}'`);

  //This turns getUser into an array
  const isAvailableCheck = (getUser!==undefined) ? getUser.rows : null;
  if (isAvailableCheck.length === 0 && isAvailableCheck!==null) {
    //This gives the data to the database
    await client.query(`INSERT INTO users (username,password) VALUES ('${uname}', '${pword}');`);
  }
  //Returns us home.
  res.redirect("/");
  client.release();
});

//Login database POST
app.post('/login', async function(req,res) {
  //This gets the data from POST submit, usually was in form of:
  //website.com?uname='_'&pword='_'
  const { uname, pword } = req.body;

  //This connects to database
  const client = await pool.connect();

  //This grabs all usernames that are the same as uname (Hopefully none)
  const getUser = await client.query(`SELECT username FROM users WHERE username='${uname}'`);

  //This turns getUser into an array
  const checkUser = (getUser!==undefined) ? getUser.rows : null;
  if (checkUser.length === 1) {
    //This gives the data to the database
    const result = await client.query(`SELECT password FROM users WHERE username='${uname}' AND password='${pword}'`);

    //This turns result into an array
    const passCheck = (result!==undefined) ? result.rows : null;
    res.send(passCheck)
  }
  //Returns us home.
  res.redirect("/");
  client.release();
});

//This allows me to read the data.json file
const fs = require('fs');
const e = require('express');

//Adding all the data from the data.json to the database
router.get('/createConsoleTable', async (req, res) => {
  try {
    //This connects to database
    const client = await pool.connect();

    //SQL that deletes consoles database, if it exists
    await client.query("DROP TABLE IF EXISTS consoles");

    //Gets an array of objects
    let data = JSON.parse(fs.readFileSync('./console_data/data.json'));

    //Creates a table if it doesn't exist
    await client.query(`CREATE TABLE IF NOT EXISTS consoles (
      cid SERIAL,
      brand varchar(255),
      type varchar(255),
      name varchar(255),
      imgurl TEXT,
      PRIMARY KEY(cid)
      );`);

    //Loops through the array of objects
    for (let i = 0; i < data.length; i++) {
      const con = data[i];
      //Inserts into the 'console' database data from 'data'
      await client.query(`INSERT INTO consoles (brand,type,name,imgurl) 
      VALUES ('Nintendo', '${con['console']}', '${con['name']}', '${con['img-url']}');`);
    }

    //Assuming no issues arrive, we are sent back to the main page
    res.redirect('/');
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This simply shows all the data inside 'consoles' database
router.get('/showconsole', async (req, res) => {
  try {
    //This connects to database
    const client = await pool.connect();

    //SQL that gets everything from 'consoles' database
    const result = await client.query("SELECT * FROM consoles");

    //This turns result into an array
    const results = { 'results': (result) ? result.rows : null};

    //Displays results array onto page
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This simply shows all the data inside 'users' database
router.get('/showusers', async (req, res) => {
  try {
    //This connects to database
    const client = await pool.connect();

    //SQL that gets everything from 'users' database
    const result = await client.query("SELECT * FROM users");

    //This turns result into an array
    const results = { 'results': (result) ? result.rows : null};

    //Displays results array onto page
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This simply shows all the data inside 'userownconsole' database
router.get('/showuserownconsole', async (req, res) => {
  try {
    //This connects to database
    const client = await pool.connect();

    //SQL that gets everything from 'userownconsole' database
    const result = await client.query("SELECT * FROM userownconsole");

    //This turns result into an array
    const results = { 'results': (result) ? result.rows : null};

    //Displays results array onto page
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This creates a table 'userownconsole' and adds sample data into it
router.get('/createUserOwnConsole', async (req, res) => {
  try {
    //This connects to database
    const client = await pool.connect();

    //SQL That creates the table if it doesn't exist
    await client.query(`CREATE TABLE IF NOT EXISTS userownconsole (
      uid INT,
      cid INT,
      PRIMARY KEY(uid,cid)
      );`);

    //SQL that inserts sample data into table that was created
    await client.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, 1);`);
    await client.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, 21);`);
    await client.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, 315);`);

    //SQL that grabs a random item as a sample
    const result = await client.query("SELECT * FROM consoles WHERE name='Nintendo Wii U Premium Console [NA]'");

    //This turns result into an array
    const results = (result) ? result.rows : null;

    //SQL that inserts the random item into the table, as a test
    await client.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, ${results[0].cid});`);

    //Displays final test on page (Will not work twice, shouldn't work anymore)
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
//create operation after users login their account , get endpoint 'create'
//in database, this will be an insertion operation, it will fetch the url params query string
// and convert it into object
router.get('/user/:id/create',async(req,res)=>{
  //req.query return the url as json object
  /**this is just a test code */
  if(req.params.id===123){
    console.log("in");
  }
  let newGame=req.query;
  console.log(newGame);
  const client = await pool.connect();
  const variable= Object.keys(newGame);
  console.log(variable);
  const values=Object.values(newGame);
  console.log(values);
  for(let i=0;i<values.length;i++){
    client.query(`INSERT INTO userownconsole (${variable[i]}) VALUES (${values[i]});`);
  }
    //once get the data from client side, the server will write data into database
    //using file system to store the data
    //we will rearrage the structure =later and seperate the code into database js
    //database.createData(gameFile,req);
  
  res.send("create a new game");
  client.release();
  //res.send("create");
});
//Crud operstion with database 
//create operation after users login their account , get endpoint 'create'
//in database, this will be an insertion operation, it will fetch the url params query string
// and convert it into object
router.get('/user/:id/create',async(req,res)=>{
  //req.query return the url as json object
  /**this is just a test code */
  if(req.params.id===123){
    console.log("in");
  }
  let newGame=req.query;
  console.log(newGame);
  const client = await pool.connect();
  const variable= Object.keys(newGame);
  console.log(variable);
  const values=Object.values(newGame);
  console.log(values);
  for(let i=0;i<values.length;i++){
    client.query(`INSERT INTO userownconsole (${variable[i]}) VALUES (${values[i]});`);
  }
    //once get the data from client side, the server will write data into database
    //using file system to store the data
    //we will rearrage the structure =later and seperate the code into database js
    //database.createData(gameFile,req);
  
  res.send("create a new game");
  client.release();
  //res.send("create");
});
router.get('/user/:id/delete',async(req,res)=>{
/**this is just a test code */
if(req.params.id===123){
  console.log("in");
}
let data=req.query;
let key=Object.keys(data);
let value=Object.values(data);
client.query(`DELETE FROM userownconsole WHERE ${key[0]}=${value[0]};`);
res.send("delete");
client.release();
});

router.get('/user/:id/update/:gameID', async(req,res)=>{
if(req.params.id===123){
  console.log("in");
}
let data=req.query;
let id=req.params.gameID;
const variable= Object.keys(data);
console.log(variable);
const values=Object.values(data);
const client = await pool.connect();
let queryString='';
for(let i=0;i<variable.length;i++){
  if(i!==variable.length-1){
    queryString+=`${variable[i]}=${values[i]},`
  }else{
    queryString+=`${variable[i]}=${values[i]}`;
  }
}

console.log(queryString);
client.query(`UPDATE userownconsole SET ${queryString} WHERE gameID=${id};`);
res.send("update");
client.release();
})

//Runs the server on heroku server or local port (I think)
const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 443);
