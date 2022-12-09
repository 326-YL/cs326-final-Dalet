const { default: axios } = require("axios");

/**
 * fetch
 */
const axios =require('axios')
const options = {
  method: 'GET',
  url: 'https://free-to-play-games-database.p.rapidapi.com/api/filter',
  params: {tag: '3d.mmorpg.fantasy.pvp', platform: 'pc'},
  headers: {
    'X-RapidAPI-Key': '4b7b7773a2msha3372b4d7c82098p1d0fb2jsn278c315b8dcc',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
  let games=response.data;
  const tr=document.getElementById('test');
      const test=document.createElement('div');
      const text=document.createTextNode(games);
      test.appendChild(text);
      tr.appendChild(test);
}).catch(function (error) {
	console.error(error);
});