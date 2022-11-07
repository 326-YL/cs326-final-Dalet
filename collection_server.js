'use strict';
let http = require('http');
let url = require('url');
let fs = require('fs');
 
//delete later
let counter = {};
const JSONfile = './counter.json';

//placeholder consoles
let nes = {
    name: "NES",
    title: "NES",
    consoles: ["nes.webp", "nes-2.webp"],
    games: [
        ["mario-game.webp", "Super Mario Bros", "B"],
        ["mario-3-game.webp", "Super Mario Bros 3", "P"],
        ["mario-3-game.webp", "Super Mario Bros 3", "P"]
    ]
}
let gba = {
    name: "gba",
    title: "Gameboy Advance",
    consoles: ["gba-sp.png"],
    games: [
        ["firered.png", "Pokemon FireRed", "P"],
        ["firered.png", "Pokemon FireRed", "P"]
    ]
}

let ds = {
    name: "3ds",
    title: "New 3DS",
    consoles: ["3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG"],
    games: [
        ["ultra-sun.png", "Pokemon Ultra Sun", "B"],
        ["mario-3d-land.jpg", "Super Mario 3D Land", "P"]
    ]
}

function errorCounter(name, response) {
    response.write("<h1> error: counter " + name + " not found. </h1>");
    response.end();
}

// No need to change this function
function readCounter(name, response) {
    response.write("<h1> counter [" + name + "] = " + counter[name] + " </h1>");
}
 
function updateCounter(name, response) {
    counter[name] += 1;

    // TODO
    fs.writeFileSync(JSONfile, JSON.stringify(counter));
    
    response.write("<h1> counter " + name + " updated </h1>");
}
 
function deleteCounter(name, response) {
    delete counter[name];
    
    // TODO
    fs.writeFileSync(JSONfile, JSON.stringify(counter));

    response.write("<h1> counter " + name + " deleted </h1>");
}
 
const headerText = { "Content-Type": "text/html" };

let server = http.createServer();
server.on('request', async (request, response) => {
    response.writeHead(200, headerText);
    let options = url.parse(request.url, true).query;
    response.write(JSON.stringify(options));
    
    if (request.url.startsWith("/create")) {
        createCounter(options.name, response);
        return;
    }
    if (!(options.name in counter)) {
        errorCounter(options.name, response);
        return;
    }
    if (request.url.startsWith("/read")) {
        readCounter(options.name, response);
    }
    else if (request.url.startsWith("/update")) {
        updateCounter(options.name, response);
    }
    else if (request.url.startsWith("/delete")) {
        deleteCounter(options.name, response);
    }
    else {
        response.write("no command found.");
    }
    response.end();
});
server.listen(8080);

/*
    obj = {
        name: String
        consoles: [String, String],
        games: [
            [img, name, stat],
            [img, name, stat]
        ]
    }
*/