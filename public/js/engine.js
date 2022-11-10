let data={}
async function Loaded(url){  
    const url="https://raw.githubusercontent.com/web-programming-org/web-programming/master/homeworks/dictionary.json";
    const response= await fetch(url);
    if(response.ok){
        const json=await response.json();
        //console.log(typeof json);
        //console.log(json);
        data=json;
    }
    else{
        return Promise.reject(response.statusText);
    }
}
module.exports={dictionaryLoaded,data}