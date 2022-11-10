let data={}
async function Loaded(){
    const response= await fetch('/search');
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
module.exports={Loaded,data}