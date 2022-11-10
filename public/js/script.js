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


async function getData() {
    let d = await fetch("https://"+window.location.hostname+"/thedata");
    if (d.ok) {
        let data = await d.json();
        return data;
    } else {
        return [];
    }
}

displayCollection();

function displayCollection() {
    let collectionArr = getData();
    console.log("test");
    console.log(collectionArr);
    let displayed = [];
    const twoDisplay = collectionArr.filter(x => {
        return x.consoles.length < 4;
    });
    for (item in collectionArr) {
        //2 box template | checks if has been displayed
        if (collectionArr[item].consoles.length < 4 && !displayed.some((t)=>t===collectionArr[item].name)) {
            displayed.push(collectionArr[item].name);
            //finds next availble one for display
            let data = null;
            let num = 0;
            if (displayed.length !== twoDisplay.length) {
                let next = twoDisplay[displayed.length];
                displayed.push(next.name);
                data = [collectionArr[item], next];
                num = 2;
            } else {
                data = [collectionArr[item]];
                num = 1;
            }
            //I wanted to do 2-box together-ver and singer-ver separately but just 
            // made this work instead using num

            //Displays them.
            const mDiv = document.createElement("div");
            if (num === 1) {
                mDiv.classList.add("console-box-row");
                mDiv.classList.add("entire-box");
                mDiv.addEventListener("click", () => {gameDropdown(data[0].name)});
                document.getElementById("article").appendChild(mDiv);
            } else if (num === 2) {
                mDiv.classList.add("console-box-row");
                mDiv.classList.add("console-box-2-row");
                document.getElementById("article").appendChild(mDiv);
            }
            for (let i=0; i < num; i++) {
                //shelf
                const div1 = document.createElement("div");
                const conDiv1 = document.createElement("div");
                if (num === 1) {
                    conDiv1.classList.add("console-box-1");
                    conDiv1.id = data[i].name;
                    mDiv.appendChild(conDiv1);
                } else if (num === 2) {
                    div1.classList.add("entire-box");
                    if (i===0) {div1.classList.add("entire-box-L");}
                    else if (i===1) {div1.classList.add("entire-box-R");}
                    mDiv.appendChild(div1);

                    conDiv1.classList.add("console-box");
                    conDiv1.id = data[i].name;
                    conDiv1.addEventListener("click", () => {gameDropdown(data[i].name)})
                    div1.appendChild(conDiv1);
                }

                //console imgs
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

                //games
                const gameDiv = document.createElement("div");
                gameDiv.id = data[i].name + "-game";
                gameDiv.classList.add("game-box");
                gameDiv.classList.add("container");
                gameDiv.classList.add("text-center");
                gameDiv.classList.add("game-hidden");
                num===1? mDiv.appendChild(gameDiv) : div1.appendChild(gameDiv);

                data[i].games.forEach(e => {
                    const gDiv = document.createElement("div");
                    gDiv.classList.add("game-item");
                    gDiv.classList.add("row");
                    gameDiv.appendChild(gDiv);

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
                    gTitle.classList.add("game-item-box");
                    gTitle.classList.add("game-txt-item");
                    gTitle.classList.add("col");
                    gDiv.appendChild(gTitle);

                    const t = document.createElement("p");
                    t.innerHTML = e[1];
                    gTitle.appendChild(t);

                    const gStat = document.createElement("div");
                    gStat.classList.add("game-item-box");
                    gStat.classList.add("game-status");
                    gStat.classList.add("col-1");
                    gDiv.appendChild(gStat);

                    const t2 = document.createElement("p");
                    switch (e[2]) {
                        case 'B':
                            t2.classList.add("game-beat");
                            t2.title = "Beat";
                            t2.innerHTML = 'B';
                            break;
                        case 'P':
                            t2.classList.add("game-played");
                            t2.title = "Played";
                            t2.innerHTML = 'P';
                            break;
                        default:
                            t2.classList.add("game-want");
                            t2.title = "Want to play";
                            t2.innerHTML = "W";
                            break;
                    }
                    gStat.appendChild(t2);
                });
            }
            document.getElementById("article").appendChild(document.createElement("br"));
        } else if (collectionArr[item].consoles.length >= 4) { //1 box template
            const data = collectionArr[item];

            const mDiv = document.createElement("div");
            mDiv.classList.add("console-box-row");
            mDiv.classList.add("console-box-1-row");
            mDiv.addEventListener("click", () => {gameDropdown(data.name)});
            document.getElementById("article").appendChild(mDiv);

            const conDiv = document.createElement("div");
            conDiv.classList.add("console-box-1");
            conDiv.id = data.name;
            mDiv.appendChild(conDiv);
            //console imgs
            data.consoles.forEach(e => {
                const img = document.createElement("img");
                img.classList.add("console-img");
                img.src = "./img/" + e;
                conDiv.appendChild(img);
            });

            const title = document.createElement("h2");
            title.classList.add("console-shelf-title");
            const titleTxt = document.createTextNode(data.title);
            title.appendChild(titleTxt);
            conDiv.appendChild(title);

            const shelf = document.createElement("div");
            shelf.classList.add("console-shelf");
            conDiv.appendChild(shelf);

            //GAMES
            const gameDiv = document.createElement("div");
            gameDiv.id = data.name + "-game";
            gameDiv.classList.add("game-box");
            gameDiv.classList.add("container");
            gameDiv.classList.add("text-center");
            gameDiv.classList.add("game-hidden");
            mDiv.appendChild(gameDiv);

            data.games.forEach(e => {
                const gDiv = document.createElement("div");
                gDiv.classList.add("game-item");
                gDiv.classList.add("row");
                gameDiv.appendChild(gDiv);

                const gPic = document.createElement("div");
                gPic.classList.add("game-item-box");
                gPic.classList.add("game-img-item");
                gPic.classList.add("col-2");
                gDiv.appendChild(gPic);

                const img = document.createElement("img");
                img.classList.add("game-img");
                img.src = "./img/" + e[0];
                gPic.appendChild(img);

                const gTitle = document.createElement("div");
                gTitle.classList.add("game-item-box");
                gTitle.classList.add("game-img-item");
                gTitle.classList.add("col");
                gDiv.appendChild(gTitle);

                const t = document.createElement("p");
                t.innerHTML = e[1];
                gTitle.appendChild(t);

                const gStat = document.createElement("div");
                gStat.classList.add("game-item-box");
                gStat.classList.add("game-status");
                gStat.classList.add("col-1");
                gDiv.appendChild(gStat);

                const t2 = document.createElement("p");
                switch (e[2]) {
                    case 'B':
                        t2.classList.add("game-beat");
                        t2.title = "Beat";
                        t2.innerHTML = 'B';
                        break;
                    case 'P':
                        t2.classList.add("game-played");
                        t2.title = "Played";
                        t2.innerHTML = 'P';
                        break;
                    default:
                        t2.classList.add("game-want");
                        t2.title = "Want to play";
                        t2.innerHTML = "W";
                        break;
                }
                gStat.appendChild(t2);
            });
            document.getElementById("article").appendChild(document.createElement("br"));
        }
    }
}