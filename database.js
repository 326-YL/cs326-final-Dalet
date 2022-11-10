//database
const fs = require('fs');
const userFile='./user.json';
const videoGameFile='./videoGame.json';
const gameFile='./vedioGame.json'
function createData(filename,object){
    console.log('filename'+filename);
    console.log(object);
    if(gameFile===filename){
        fs.writeFile(filename,JSON.stringify(object))
    }
    
}


function updateData(filename,req,res){



}

function deleteData(filename,req,res){




}

function searchData(filename,object,url){


return object;


}

module.exports={createData,searchData}
 