/**
 * fetch
 */
 async function getNews(){
   const url='https://free-to-play-games-database.p.rapidapi.com/api/filter?tag=3d.mmorpg.fantasy.pvp&platform=pc';
   const res=await fetch(url,{
       method:'GET',
       headers:{
        'X-RapidAPI-Key': '4b7b7773a2msha3372b4d7c82098p1d0fb2jsn278c315b8dcc',
        'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
      }
   });
   if(res.ok){
       const data=res.json();
       console.log(data);
   }
 }
 getNews();