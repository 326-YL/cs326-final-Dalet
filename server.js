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

//to include all assets (css files and images)
app.use(express.static(path.join(__dirname,'public')));

//add the router
app.use('/', router);

router.get('/',function(req,res){
  if (req.query.page === "test") {
    res.redirect('/collection');
  }
  res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to the project folder.
  // res.send("test");
});


router.get('/index',function(req,res){
  res.redirect('/')
  //res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to the project folder.
});


router.get('/explore',function(req,res){
  res.sendFile(path.join(__dirname+'/public/explore.html'));
});

router.get('/collection',function(req,res){
  res.sendFile(path.join(__dirname+'/public/collection.html'));
});

router.get('/thedata', function(req, res) {
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
  res.send(JSON.stringify(cArr));
});

//This access database, 'pool' refers to a datapool (I'd imagine)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//This allows me to get the data from body easily
app.use(express.urlencoded({extended:true}));

app.post('/signup', async function(req,res) {
  //This gets the data from POST submit, usually was in form of:
  //website.com?uname='_'&pword='_'
  const { uname, pword } = req.body;

  //This connects to database
  const client = await pool.connect();
  //This grabs all usernames that are the same as uname (Hopefully none)
  const getUser = await client.query(`SELECT username FROM users WHERE username='${uname}'`);
  const isAvailableCheck = (getUser!==undefined) ? getUser.rows : null;
  if (isAvailableCheck.length === 0 && isAvailableCheck!==null) {
    //This gives the data to the database
    const result = await client.query(`INSERT INTO users (username,password) VALUES ('${uname}', '${pword}');`);
  }
  //Returns us home.
  res.redirect("/");
});

app.post('/login', async function(req,res) {
  //This gets the data from POST submit, usually was in form of:
  //website.com?uname='_'&pword='_'
  const { uname, pword } = req.body;

  //This connects to database
  const client = await pool.connect();
  //This grabs all usernames that are the same as uname (Hopefully none)
  const getUser = await client.query(`SELECT username FROM users WHERE username='${uname}'`);
  const checkUser = (getUser!==undefined) ? getUser.rows : null;
  if (checkUser.length === 1) {
    //This gives the data to the database
    const result = await client.query(`SELECT password FROM users WHERE username='${uname}' AND password='${pword}'`);
    const passCheck = (result!==undefined) ? result.rows : null;
    res.send(passCheck)
  }
  //Returns us home.
  res.redirect("/");
});

//database testing
const fs = require('fs');
router.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("DROP TABLE consoles");
    let data = JSON.parse(fs.readFileSync('./data (backup-nes).json'));
    await client.query(`CREATE TABLE IF NOT EXISTS consoles (
      cid SERIAL,
      brand varchar(255),
      type varchar(255),
      name varchar(255),
      imgurl varchar(255),
      PRIMARY KEY(cid)
      );`);
    for (let i = 0; i < data.length; i++) {
      const con = data[i];
      await client.query(`INSERT INTO consoles (brand,type,name,imgurl) 
      VALUES ('${con['Brand']}', '${con['console']}', '${con['name']}', 
      '${con['img-url']}');`);
      
    }

    // const result = await client.query("INSERT INTO test (uid, username,password) VALUES (1, 'test', 'test');");
    
    // const result = await client.query("SELECT * FROM users");
    // const results = { 'results': (result) ? result.rows : null};
    // res.send(results);
    // res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

router.get('/dbtest', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM consoles");
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//Stuff idk idc about

//CRUD operation

//allow user to login, will pop out the log in page
router.get('/login',function(req,res){
  res.send('<h>Plase Login</h>')

});

//create operation after users login their account , get endpoint 'create'
router.get('/create/:id',function(req,res){
    //req.query return the url as json object
    /**this is just a test code */
    if(req.query.id===123){
      let object=req.query
      //once get the data from client side, the server will write data into database
      //using file system to store the data
      database.createData(gameFile,req);
    }
    console.log('create')
    res.send('create');
});

router.get('/user/:id/delete',function(req,res){

  /**this is just a test code */
   if(req.query.id==123){
    let object=req.query
       console.log('delete')
      //once get the data from client side, the server will write data into database
      //using file system to store the data
      //database.deleteData(gameFile,req);
   }
   res.send("delete");
})


//place * before/search will allow any users or visitors on client side at 
//any pages do search operation
router.get('/search',function(req,res){
   //let title=req.query.title;
   //let edition=req.query.edition;
   
   console.log("in search");
   console.log(req.protocol);
   console.log(req.baseUrl);
   console.log(process.env.NODE_ENV)
   res.send(req.query);
   //const url="https://boiling-lake-51546.herokuapp.com"+req.url
   console.log("url:"+url);
   //url=url+req.url;
   //console.log("url:"+url);
   //loadObject.Loaded(url)
   res.sendFile(path.join(__dirname+'/public/game.html'));
})

const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 443);