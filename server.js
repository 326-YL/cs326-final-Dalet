const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const database=require("./database")
const http=require('http');
const { loadObject } = require('./public/js/gameView');
const httpServer=http.createServer(app);
const gameFile='./vedioGame.json'
const deployment="https://boiling-lake-51546.herokuapp.com"
const localtesting='http://localhost:8000/'
const url = (process.env.NODE_ENV ? production : development);

//to include all assets (css files and images)
app.use(express.static(path.join(__dirname,'public')));

//add the router
app.use('/', router);

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to the project folder.
});


router.get('/index',function(req,res){
  res.redirect('/')
  //res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to the project folder.
});


router.get('/explore',function(req,res){

  res.sendFile(path.join(__dirname+'/explore.html'));
});

router.get('/collection',function(req,res){
  res.sendFile(path.join(__dirname+'/collection.html'));
});

//CRUD operation

//allow user to login, will pop out the log in page
router.get('/*/login',function(req,res){
   res.send('<h>Plase Login</h>')

})

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
   res.send("in seachs")
   console.log("in search");
   console.log(req.protocol);
   console.log(req.baseUrl);
   console.log(process.env.NODE_ENV)
   //const url="https://boiling-lake-51546.herokuapp.com"+req.url
   console.log(url);
   //loadObject(url)
   res.sendFile(path.join(__dirname+'/public/searchResult.html'));
})



httpServer.listen(process.env.PORT|| 443)
