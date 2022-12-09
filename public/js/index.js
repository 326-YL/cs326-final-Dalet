let gameNews={};
const express = require('express');
/**
 * fetch game news data from api
 */
async function getNews(res){
    const res=await fetch('https://videogames-news2.p.rapidapi.com/videogames_news/search_news');
    if(res.ok){
        const json=await res.json();
        console.log(json);
        res.send(json);
    }
    
}
/**
 * fetch
 */