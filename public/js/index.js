/**
 * fetch
 */
 const http = require("https");

 const options = {
     "method": "GET",
     "hostname": "free-to-play-games-database.p.rapidapi.com",
     "port": null,
     "path": "/api/filter?tag=3d.mmorpg.fantasy.pvp&platform=pc",
     "headers": {
         "X-RapidAPI-Key": "4b7b7773a2msha3372b4d7c82098p1d0fb2jsn278c315b8dcc",
         "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com",
         "useQueryString": true
     }
 };
 
 const req = http.request(options, function (res) {
     const chunks = [];
 
     res.on("data", function (chunk) {
         chunks.push(chunk);
     });
 
     res.on("end", function () {
         const body = Buffer.concat(chunks);
         console.log(body.toString());
     });
 });
 
 req.end();