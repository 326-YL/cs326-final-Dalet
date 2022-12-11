const path = require('path');
const bcrypt =require('bcrypt');
const cookieParser = require('cookie-parser');
const session=require('express-session');
const flash=require('express-flash');
const express = require('express');

const router = express.Router();
const http=require('http');
//This allows me to read the data.json file
const fs = require('fs');
const passport=require("passport");
const initializePassport=require("./passportConfig");
initializePassport(passport);
const client=require("./database").client;
const app = express();





//MAIN PAGE ROUTES

//to include all assets (css files and images)
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.set('trust proxy', 1);
app.use(
  session({ 
    secret:"secret",
    resave:false,
    saveUnitialized:false
  }))

app.use(passport.session());
app.use(passport.initialize());

app.use(flash());

//add the router
app.use('/', router);
app.set("view engine","ejs");

//Index page
app.get('/',function(req,res){
  //sends index.html to the client
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/index',function(req,res){
  //redirects to above route
  res.redirect('/')
});

//collection page
app.get('/collection',function(req,res){
  //sends collection.html to the client
  res.sendFile(path.join(__dirname+'/public/collection.html'));
});

//explore page
app.get('/explore',function(req,res){
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
app.get('/thedata', async function(req, res) {
  //This connects to database
  const client2 = await pool.connect();

  //Queries the database
  const result = await client2.query(`SELECT * FROM userownconsole INNER JOIN consoles ON 
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
      consoles: ["img/gba-sp.png"],
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
        consoles: ['https://'+x.imgurl],
        games: []
      }
      newArr.push(obj);
    } else {
      newArr[index].consoles.push('https://'+x.imgurl);
    }
  });

  //temp 'games' array
  newArr[2].games = [["mario-game.webp", "Super Mario Bros", "B"],
  ["mario-3-game.webp", "Super Mario Bros 3", "P"],
  ["mario-3-game.webp", "Super Mario Bros 3", "P"]];
  newArr[3].games = [["mario-64-game.webp", "Super Mario 64", "W"]];

  res.send(JSON.stringify(newArr));
  client2.release();
});

//Data for the explore.html
router.get('/thedatatoo', async function(req, res) {
  //This connects to database
  const client2= await pool.connect();

  //Queries the database
  const result = await client2.query(`SELECT * FROM consoles`);
  const results = (result) ? result.rows : null;

  let newArr = [
    //id, brand, kind, type, name, img
  ];
  
  //Takes the query and turn it into something like cArr
  results.forEach(x => {
    const newObj = {
      id: x.cid,
      Brand: x.brand,
      Kind: "console",
      Type: x.type,
      name: x.name,
      img: x.imgurl
    }
    newArr.push(newObj);
  });

  res.send(JSON.stringify(newArr));
  client2.release();
});

//This allows me to get the data from body easily


//Signup database POST
app.post('/users/signUp', async function(req,res) {
  //This gets the data from POST submit, usually was in form of:
  //website.com?uname='_'&pword='_'
  const {uname,email,pword,pword2} = req.body;
  let result=client.query(`SELECT * FROM users_info`,(err,re)=>{
    console.log(re.rows);
  });
        //console.log(result.rows);
  console.log(
    {uname,email,pword,pword2}
  )
  let errors=[],nameRepeat='',emailRepeat='';
  if(!uname||!email||!pword||!pword2){
    errors.push({message:'fields can not be empty!'})
    
  };
  if(pword.length<8){
    errors.push({message:'password length must be greater then 8'})
    
  };
  if(pword!==pword2){
    errors.push({message:'second password does not match the first one'})
  }
  if(errors.length>0){
    console.log("errors:");``
    console.log(errors);
    res.render('signUp',{errors});
  }else{
   try{
     let hashword=await bcrypt.hash(pword,10);
     console.log("what row here?");
     await client.query(`CREATE TABLE IF NOT EXISTS users_info (
      id SERIAL,
      username VARCHAR(255),
      email VARCHAR(255),
      password VARCHAR(255),
      PRIMARY KEY(id)
      );`);

      const getUser =client.query(`SELECT COUNT(*) FROM users_info WHERE username=$1;`,[uname],
           (err,result)=>{
             console.log(err);
             console.log("the result here:");
             console.log(result.rows[0]);
  });
  if(getUser!==undefined){
    nameRepeat="the username is already in use, please try again;"
    res.render('signUp',{nameRepeat})
  }
  const getEmail=client.query(`SELECT COUNT(*) FROM users_info WHERE email=$1;`,[email],
           (err,result)=>{
             console.log(err);
             
  });
    if(getEmail!==undefined){
      emailRepeat="the username is already in use, please try again;"
      res.render('signUp',{emailRepeat})
    }
    else{
    client.query(`INSERT INTO users_info(username,password,email) VALUES ($1, $2,$3)
          RETURNING id,password`, [uname,hashword,email],
          (err,result)=>{
            if(err){
              throw err;
            }
            console.log("the result here:");
            console.log(result.rows[0]);
            console.log("insert");
            req.flash('meg',"succussfully sign up your account now,please login");
            console.log("going to jump to login")
            res.redirect('/users/login');
        });
    }         
  }catch(e){
    console.log(e);
  }
 }
  //Returns us home.
  //client.release();
});

//Login database POST
app.post("/users/login",passport.authenticate('local',{
   successRedirect:"/users/gameBoard",
   failureRedirect:"/users/login",
   failureFlash:true
})
);
function isUserAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect("/");
  }
  next();
}
function isNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}
app.get('/users/signUp',isUserAuthenticated,(req,res,)=>{
  res.render("signUp");
});

app.get('/users/login',isUserAuthenticated,(req,res)=>{
  res.render("login");
});
app.get('/users/gameBoard',isNotAuthenticated,async(req,res)=>{
  const username=req.user.username;
  const email=req.user.email;
  const pw=req.user.password;
 
   /*client.query(`SELECT email FROM users_info WHERE username=$1`,[username],(err,result)=>{
    if(err){
      throw err;
    }
    console.log("fetch email here:");
    console.log(result.rows[0]);
   // let email= result.rows[0].email;

  })*/
  let data={
    username:username,
    email:email
  }
  console.log([data]);
  res.render("gameBoard",{data});
});
app.get('/users/logout',(req,res)=>{
  req.logout(req.user, err => {
    if(err) return next(err);
    req.flash('success_msg',"log out");
    res.redirect("/")

  });
    //req.flash('success_msg',"log out");
    //res.redirect("/users/login")
 // });
  
});

app.get('/users/gameBoard/search',(req,res)=>{

  let brand=req.query.brand;
  let keyword=req.query.keyword;
  keyword="%"+keyword+"%";
  let limit=req.query.limit;
  
  client.query(`SELECT * FROM consoles WHERE brand=$1 AND name like $2 limit $3`,[brand],[keyword],[limit],
     (err,result)=>{
        if(err) throw err;
        console.log(result.rows);

        res.render('/users/gameBoard');
     })


  



})
/*
app.post('/users/login', async function(req,res) {
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
  res.send({'validate':'true'});
  //res.redirect("/");
  //client.release();
});

*/

//Adding all the data from the data.json to the database
app.get('/createConsoleTable', async (req, res) => {
  try {
    //This connects to database
    //const client2 = await poo
    l.connect();
    console.log("in");
    //SQL that deletes consoles database, if it exists
    await client.query("DROP TABLE IF EXISTS consoles");

    //Gets an array of objects
    const nintendo = JSON.parse(fs.readFileSync('./console_data/n-data.json'));
    console.log(nintendo);
    const sony = JSON.parse(fs.readFileSync('./console_data/sony-data.json'));
    const microsoft = JSON.parse(fs.readFileSync('./console_data/ms-data.json'));

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
    for (let i = 0; i < nintendo.length; i++) {
      const con = nintendo[i];
      //Inserts into the 'console' database data from 'data'
      await client.query(`INSERT INTO consoles (brand,type,name,imgurl) 
      VALUES ('Nintendo', '${con['console']}', '${con['name']}', '${con['img-url']}');`);
    }
    //Loops through the array of objects
    for (let i = 0; i < sony.length; i++) {
      const con = sony[i];
      //Inserts into the 'console' database data from 'data'
      await client.query(`INSERT INTO consoles (brand,type,name,imgurl) 
      VALUES ('Sony', '${con['console']}', '${con['name']}', '${con['img-url']}');`);
    }
    //Loops through the array of objects
    for (let i = 0; i < microsoft.length; i++) {
      const con = microsoft[i];
      //Inserts into the 'console' database data from 'data'
      await client.query(`INSERT INTO consoles (brand,type,name,imgurl) 
      VALUES ('Microsoft', '${con['console']}', '${con['name']}', '${con['img-url']}');`);
    }

    //Assuming no issues arrive, we are sent back to the main page
    res.redirect('/');
    //client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This simply shows all the data inside 'consoles' database
app.get('/showconsole', async (req, res) => {
  try {
    //This connects to database
    //const client2 = await pool.connect();

    //SQL that gets everything from 'consoles' database
    const result = await client.query("SELECT * FROM consoles");

    //This turns result into an array
    const results = { 'results': (result) ? result.rows : null};

    //Displays results array onto page
    res.send(results);
    client2.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This simply shows all the data inside 'users' database
 app.get('/showusers', async (req, res) => {
  try {
    //This connects to database
    //const client2 = await pool.connect();

    //SQL that gets everything from 'users' database
    const result = await client.query("SELECT * FROM users");

    //This turns result into an array
    const results = { 'results': (result) ? result.rows : null};

    //Displays results array onto page
    res.send(results);
    client2.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This simply shows all the data inside 'userownconsole' database
router.get('/showuserownconsole', async (req, res) => {
  try {
    //This connects to database
    //const client2 = await pool.connect();

    //SQL that gets everything from 'userownconsole' database
    const result = await client.query("SELECT * FROM userownconsole");

    //This turns result into an array
    const results = { 'results': (result) ? result.rows : null};

    //Displays results array onto page
    res.send(results);
    client2.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//This creates a table 'userownconsole' and adds sample data into it
router.get('/createUserOwnConsole', async (req, res) => {
  try {
    //This connects to database
    const client2 = await pool.connect();

    //SQL That creates the table if it doesn't exist
    await client2.query(`CREATE TABLE IF NOT EXISTS userownconsole (
      uid INT,
      cid INT,
      PRIMARY KEY(uid,cid)
      );`);

    //SQL that inserts sample data into table that was created
    await client2.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, 1);`);
    await client2.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, 21);`);
    await client2.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, 315);`);

    //SQL that grabs a random item as a sample
    const result = await client2.query("SELECT * FROM consoles WHERE name='Nintendo Wii U Premium Console [NA]'");

    //This turns result into an array
    const results = (result) ? result.rows : null;

    //SQL that inserts the random item into the table, as a test
    await client2.query(`INSERT INTO userownconsole (uid, cid) VALUES (1, ${results[0].cid});`);

    //Displays final test on page (Will not work twice, shouldn't work anymore)
    res.send(results);
    client2.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
//create operation after users login their account , get endpoint 'create'
//in database, this will be an insertion operation, it will fetch the url params query string
// and convert it into object
app.get('/user/:id/create',async(req,res)=>{
  //req.query return the url as json object
  /**this is just a test code */
  if(req.params.id===123){
    console.log("in");
  }
  let newGame=req.query;
  console.log(newGame);
  //const client = await pool.connect();
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
  //client.release();
  //res.send("create");
});
//Crud operstion with database 
//create operation after users login their account , get endpoint 'create'
//in database, this will be an insertion operation, it will fetch the url params query string
// and convert it into object
app.get('/user/:id/create',async(req,res)=>{
  //req.query return the url as json object
  /**this is just a test code */
  if(req.params.id===123){
    console.log("in");
  }
  let newGame=req.query;
  console.log(newGame);
  //const client = await pool.connect();
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
  //client.release();
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
//client.release();
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
//client.release();
})


//Runs the server on heroku server or local port (I think)
const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 443);
