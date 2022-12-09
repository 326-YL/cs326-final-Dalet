/**
 * fetch game news data from api
 */
 const axios = require("axios");

 const options = {
   method: 'GET',
   url: 'https://videogames-news2.p.rapidapi.com/videogames_news/search_news',
   params: {query: 'GTA'},
   headers: {
     'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
     'X-RapidAPI-Host': 'videogames-news2.p.rapidapi.com'
   }
 };
 
 axios.request(options).then(function (response) {
     console.log(response.data);
 }).catch(function (error) {
     console.error(error);
 });
/**
 * fetch
 */