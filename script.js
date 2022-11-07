function gameDropdown(console) {
    const consoleEl = document.getElementById(console);
    const gameEl = document.getElementById(console+"-game");
    if (gameEl.classList.contains("game-hidden")) {
        gameEl.classList.remove("game-hidden");
    } else {
        gameEl.classList.add("game-hidden");
    }
  }
  
// Get games or something?
const explore_items = [
{ image: 'img1', name: 'console1', type: 'console' },
{ image: 'img2', name: 'console2', type: 'console' },
{ image: 'img3', name: 'game1', type: 'game' },
{ image: 'img4', name: 'game2', type: 'game' },
{ image: 'img5', name: 'game3', type: 'game' },
{ image: 'img6', name: 'game4', type: 'game' },
{ image: 'img7', name: 'game5', type: 'game' }
];
function onload_explore_gallery() {
    const element = document.getElementById('explore-gallery');
    explore_items.forEach(item => {
        const newelm = document.createElement('div');
        newelm.appendChild(document.createTextNode(item.image + ' ' + item.name));
        newelm.classList.add('explore-gallery-element');
        newelm.classList.add('explore-type-' + item.type);
        newelm.addEventListener('click', () => {
            console.log(`coming from ${ item.name }! I am a ${ item.type }!`);
        });
        element.appendChild(newelm);
    });
}

document.getElementById("greyBackground").addEventListener("click", (e) => { 
    if(e.target === document.getElementById("greyBackground")){ 
      login(0);
    } 
   }); 
//login screen appearance
function login(val) {
    let loginDiv = document.getElementById("greyBackground");
    if (val===0) {
        loginDiv.style.display = "none";
    } else if (val===1) {
        loginDiv.style.display = "block";
    }
}

let cArr = [
    {
        name: "NES",
        title: "NES",
        consoles: ["nes.webp", "nes-2.webp"],
        games: [
            ["mario-game.webp", "Super Mario Bros", "B"],
            ["mario-3-game.webp", "Super Mario Bros 3", "P"],
            ["mario-3-game.webp", "Super Mario Bros 3", "P"]
        ]
    },
    {
        name: "gba",
        title: "Gameboy Advance",
        consoles: ["gba-sp.png"],
        games: [
            ["firered.png", "Pokemon FireRed", "P"],
            ["firered.png", "Pokemon FireRed", "P"]
        ]
    },
    {
        name: "3ds",
        title: "New 3DS",
        consoles: ["3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG", "3ds.JPG"],
        games: [
            ["ultra-sun.png", "Pokemon Ultra Sun", "B"],
            ["mario-3d-land.jpg", "Super Mario 3D Land", "P"]
        ]
    }
];

displayCollection(cArr);

function displayCollection(collectionArr) {
    let displayed = [];
    const twoDisplay = collectionArr.filter(x => {
        return x.consoles.length < 4;
    });
    console.log(twoDisplay.length);
    for (item in collectionArr) {
        //2 box template | checks if has been displayed
        if (collectionArr[item].consoles.length < 4 && !displayed.some((t)=>t===collectionArr[item].name)) {
            displayed.push(collectionArr[item].name);
            //finds next availble one for display
            let next = null;
            let count = 0;
            while (next===null) {
                if (!displayed.some((t)=>t===twoDisplay[count].name)) {
                    next = twoDisplay[count];
                }
                count++;
            }
            displayed.push(next.name);

            const data = [collectionArr[item], next];

            //Displays them.
            const mDiv = document.createElement("div");
            mDiv.classList.add("console-box-row");
            mDiv.classList.add("console-box-2-row");
            for (let i=0; i < 2; i++) {
                //shelf1
                const div1 = document.createElement("div");
                div1.classList.add("entire-box");
                if (i===0) {div1.classList.add("entire-box-L");}
                else if (i===1) {div1.classList.add("entire-box-R");}
                
                mDiv.appendChild(div1);

                const conDiv1 = document.createElement("div");
                conDiv1.classList.add("console-box");
                conDiv1.id = data[i].name;
                conDiv1.addEventListener("click", () => {gameDropdown(data[i].name)})
                div1.appendChild(conDiv1);

                data[i].consoles.forEach(e => {
                    const img = document.createElement("img");
                    img.classList.add("console-img");
                    img.src = "./img/" + e;
                    conDiv1.appendChild(img);
                });

                const title = document.createElement("h2");
                title.classList.add("console-shelf-title");
                const titleTxt = document.createTextNode(data[i].title);
                title.appendChild(titleTxt);
                conDiv1.appendChild(title);

                const shelf1 = document.createElement("div");
                shelf1.classList.add("console-shelf");
                conDiv1.appendChild(shelf1);

                //games1
                const gameDiv1 = document.createElement("div");
                gameDiv1.id = data[i].name + "-game";
                gameDiv1.classList.add("game-box");
                gameDiv1.classList.add("container");
                gameDiv1.classList.add("text-center");
                gameDiv1.classList.add("game-hidden");
                div1.appendChild(gameDiv1);

                data[i].games.forEach(e => {
                    const gDiv = document.createElement("div");
                    gDiv.classList.add("game-item");
                    gDiv.classList.add("row");
                    gameDiv1.appendChild(gDiv);

                    const gPic = document.createElement("div");
                    gPic.classList.add("game-item-box");
                    gPic.classList.add("game-img-item");
                    gPic.classList.add("col-4");
                    gDiv.appendChild(gPic);

                    const img = document.createElement("img");
                    img.classList.add("game-img");
                    img.src = "./img/" + e[0];
                    gPic.appendChild(img);

                    const gTitle = document.createElement("div");
                    gPic.classList.add("game-item-box");
                    gPic.classList.add("game-img-item");
                    gPic.classList.add("col");
                    gDiv.appendChild(gTitle);

                    const t = document.createElement("p");
                    t.value = e[1];
                    gTitle.appendChild(t);

                    const gStat = document.createElement("div");
                    gPic.classList.add("game-item-box");
                    gPic.classList.add("game-img-item");
                    gPic.classList.add("col-1");
                    gDiv.appendChild(gStat);

                    const t2 = document.createElement("p");
                    t2.classList.add("game-beat") //  <----------------- change later
                    t2.title = "Beat"
                    t2.value = e[2];
                    gTitle.appendChild(t);
                });
            }

            // <div id="gba-game" class="game-box container text-center game-hidden">
            //     <div class="game-item row">
            //         <div class="game-item-box game-img-item col-4">
            //             <img class="game-img" src="./img/firered.png">
            //         </div>
            //         <div class="game-item-box game-txt-item col">
            //             <p>Pokemon Firered</p>
            //         </div>
            //         <div class="game-item-box game-status col-1">
            //             <p class="game-played" title="Played">P</p>
            //         </div>
            //     </div>
            document.getElementById("article").appendChild(mDiv);

        } else { //1 box template

        }
    }
}