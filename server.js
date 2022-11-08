const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const http=require('http')
const httpServer=http.createServer(app);
httpServer.listen(process.env.PORT|| 443)

//to include all assets
app.use(express.static(path.join(__dirname,'public')));



router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to the project folder.
});



router.get('/Explore',function(req,res){

  res.sendFile(path.join(__dirname+'/public/explore.html'));
});

router.get('/My Collection',function(req,res){
  res.sendFile(path.join(__dirname+'/public/collection.html'));
});

//add the router
app.use('/', router);

//app.listen(process.env.PORT|| 443);
