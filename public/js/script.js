function gameDropdown(console) {
    const consoleEl = document.getElementById(console);
    const gameEl = document.getElementById(console+"-game");
    if (gameEl.classList.contains("game-hidden")) {
        gameEl.classList.remove("game-hidden");
    } else {
        gameEl.classList.add("game-hidden");
    }
}
  
/**
 * 
 * @param { Array<Any> } _arr array to be shuffled 
 * @returns new array that is randomly shuffled
 */
function shuffle(_arr) {
    let arr = [..._arr];
    for (let i = arr.length - 1; i > 0; --i) {
        let index = Math.floor((i + 1) * Math.random());
        let temp = arr[index];
        arr[index] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function explore_button_on(bool) {
    const button = document.getElementById('explore-back');
    bool ? button.classList.remove('explore-hidden')
         : button.classList.add('explore-hidden');
}

/**
 * 
 * @param { Array<Entry> } _arr is an array of database entries --- does not get editted in reference
 * @param { number } n is the number of elements to render every time.
 * @param { (html.div_element, Entry) => html.div_element } func takes in an element and an entry from the database and edits it
 * 
 * Of note: @param func is applied to every single entry in @param arr, so write it accordingly
 * Every div edited by @param func will be appened to the explore-gallery
 * This function will also set the 'view more' button to display @param arr
 */
async function explore_gallery_render(_arr, func) {
    const element = document.getElementById('explore-gallery');
    const arr = [..._arr]; // Copy contents
    const closure = () => {
        arr.splice(0, 16).forEach(async item => {
            const newdiv = document.createElement('div');
            newdiv.classList.add('explore-gallery-element');            
            func(newdiv, item);
            element.appendChild(newdiv);
        });
        const elm = document.getElementById('explore-more');
        if (arr.length === 0) {
            // If there are no items to display left
            elm.classList.add('explore-hidden');
        } else {
            // If there are items to display, show the button
            elm.classList.remove('explore-hidden');
        }
    }
    document.getElementById('explore-more').onclick = closure;
    closure();
}

/**
 * 
 * @param { Object } filter Object with predetermined attributes to filter by
 *
 * Feel free to add any you may want below
 * 
 * @PREDETERMINED_FILTERS :
 * @param { String } brand filters by brand name
 * @param { String } type filters by the Entry.Type value
 * @param { boolean } consoles includes consoles
 * @param { boolean } games includes games
 * @param { String } console_name name of the console the game is from
 * @param { Array<String> } keys_arr string keys for searching through games, consoles, and brands
 * @PREDETERMINED_DATA_DISPLAYS
 * @param { boolean } types_only displays the array of types
 * 
 * This function will display interactable database entries based on the given filter,
 * whether that be what console, brand, name, etc. it has.
 * 
 * The attributes will either be given or not. Ones that are not given will be ignored.
 * 
 */
async function load_explore_filter(filter) {
    const request = window.location.hostname !== "127.0.0.1"
        ? await fetch('https://pacific-beach-91707.herokuapp.com/thedatatoo')
        : {
            ok: true,
            status: 202,
            json: () => {
                return [
                    { Type: "NES", Kind: "Playstation", name: "Playstaion 2", Brand: "Sony", img: ""},
                    { Type: "NES", Kind: "console", name: "mario", Brand: "Sony", img: ""},
                    { Type: "NES", Kind: "console", name: "mario", Brand: "Sony", img: ""},
                    { Type: "NES", Kind: "console", name: "mario", Brand: "Sony", img: ""},
                    { Type: "obj3", Kind: "console", name: "mario", Brand: "Sony", img: ""},
                    { Type: "obj4", Kind: "console", name: "mario", Brand: "Sony", img: ""},
                    { Type: "obj5", Kind: "console", name: "mario", Brand: "Sony", img: ""},
                    { Type: "Playstation", Kind: "Playstation", name: "Playstaion 2 better result", Brand: "Sony", img: ""},
                    { Type: "console1", Kind: "console", name: "mario", Brand: "Microsoft", img: ""},
                    { Type: "console2", Kind: "console", name: "mario", Brand: "Microsoft", img: ""},
                    { Type: "obj3", Kind: "console", name: "mario", Brand: "Microsoft", img: ""},
                    { Type: "obj4", Kind: "console", name: "mario", Brand: "Microsoft", img: ""},
                    { Type: "obj5", Kind: "console", name: "mario", Brand: "Microsoft", img: ""},
                ];
            }
        }
    // console.log(request);
    if (!request.ok || request.status === 404) {
        console.log('error getting explore datat\ncheck the link');
        return;
    }
    const explore_items = await request.json();
    // Change keys to lowercase --- Used when filtering
    if (filter.keys_arr !== undefined) {
        filter.keys_arr = filter.keys_arr.map(key => key.toLowerCase());
    }
    let types_array = [];
    let search_map = [];
    let filtered_items = explore_items.filter((item) => {
        //  * @param { String } brand filters by brand name
        //  * @param { String } type filters by the Entry.Type value
        //  * @param { boolean } consoles includes consoles
        //  * @param { boolean } games includes games
        //  * @param { String } console_name name of the console the game is from
        //  * @param { Array<String> } keys strings for filtering generally
        if ((filter.brand ?? item.Brand) !== item.Brand) {
            return false;
        }
        if ((filter.type ?? item.Type) !== item.Type) {
            return false;
        }
        if ((filter.console ?? false) && item.Kind === "console") {
            return false;
        }
        if ((filter.game ?? false) && item.Kind === "game") {
            return false;
        }
        if (filter.keys_arr !== undefined && filter.keys_arr.length !== 0) {
            let value = filter.keys_arr.reduce((sum, key) => {
                return sum + (item.Brand.toLowerCase().includes(key) ? 1 : 0)
                           + (item.Kind.toLowerCase().includes(key) ? 1 : 0)
                           + (item.Type.toLowerCase().includes(key) ? 1 : 0)
                           + (item.name.toLowerCase().includes(key) ? 1 : 0);
            }, 0);
            if (search_map[value] === undefined) {
                search_map[value] = [];
            }
            search_map[value].push(item);
        }
        if ((filter.types_only ?? false) && !types_array.includes(item.Type)) {
            // Get unique types
            types_array.push(item.Type);
        }
        return true;
    });
    if (filtered_items.length === 0) {
        document.getElementById('explore-back').click();
        return;
    }

    filtered_items.sort((a, b) => a.name < b.name ? -1 : 1);

    const console_func = (newelm, item) => {
        const txtSpan = document.createElement('span');
        txtSpan.classList.add('explore-item-txt');
        txtSpan.appendChild(document.createTextNode(item.name));
        newelm.appendChild(txtSpan);
        const image = document.createElement('img');
        image.src = "https://" + item.img; // item.img doesn't have 'https://' tag
        image.classList.add('explore-image');
        newelm.appendChild(image);
        newelm.addEventListener('click', () => {
            // Select the console
            if (newelm.classList.contains('explore-gallery-selected')) {
                newelm.classList.remove('explore-gallery-selected');
            } else {
                newelm.classList.add('explore-gallery-selected');
            }
            console.log(`coming from ${ item.title }! I am ${ item.name }!`);
        });
    };
    const type_to_console = (newelm, item) => {
        const txtSpan = document.createElement('span');
        txtSpan.classList.add('explore-item-txt');
        txtSpan.appendChild(document.createTextNode(item));
        newelm.appendChild(txtSpan);
        newelm.addEventListener('click', () => {
            explore_call(async () => { await load_explore_filter({ brand: filter.brand, type: item })});
        });
    };
    // Clear gallery
    explore_gallery_clear();
    // Display
    if (types_array.length > 0) {
        explore_gallery_render([...types_array], type_to_console);
    } else if (search_map.length > 0) {
        // Array of weighted searched items
        console.log('here');
        const input = search_map.reduceRight((arr, elm) => {
            return elm === undefined ? arr : arr.concat(elm);
        }, []);
        explore_gallery_render([...input], console_func);
    } else {
        explore_gallery_render([...filtered_items], console_func);
    }
}

/**
 * Clears the inner html of explore-gallery
 */
async function explore_gallery_clear() {
    document.getElementById('explore-gallery').innerHTML = '';
}

/**
 * 
 * @param { function: any } func calls a function that calls load_explore_filter or explore_load_gallery
 * 
 * The purpose of this function is to save the states of each search.
 * Mostly to prevent redundent code elsewhere.
 *  
 */
async function explore_call(func) {
    if (window.explore_current_call !== undefined) {
        window.stack.push(window.explore_current_call);
        explore_button_on(true);
    }
    window.explore_current_call = func;
    func();
}

async function explore_onload() {
    
    window.stack = [];
    window.explore_current_call = undefined;
    const back_button = document.getElementById('explore-back');
    const all_filter_button = document.getElementById('explore-search-showall');

    const brands = [
        { name: 'Microsoft', img_url: '' , other: {}},
        { name: 'Sony', img_url: '', other: {}},
        { name: 'Nintendo', img_url: '', other: {}}
    ];
    const brand_to_type = (newelm, item) => {
        const txtSpan = document.createElement('span');
        txtSpan.classList.add('explore-item-txt');
        txtSpan.appendChild(document.createTextNode(item.name));
        newelm.appendChild(txtSpan);
        // --- Clicking on a brand ---
        newelm.onclick = async () => {
            console.log(item.name + ' is the brand');
            explore_call(async () => { await load_explore_filter({ brand: item.name, types_only: true }); });
        };
    };
    
    // Render brands
    explore_call(async () => { explore_gallery_render(brands, brand_to_type); });
    
    const search_input = document.getElementById('explore-search-input');
    search_input.addEventListener('keypress', async (event) => {
        const input_str = search_input.value;
        if (event.key === 'Enter') {
            explore_call(async () => { await load_explore_filter({ keys_arr: input_str.split(' ')}); });
        }
    });
    back_button.onclick = async () => {
        window.explore_current_call = window.stack.pop();
        explore_gallery_clear();
        window.explore_current_call();
        if (window.stack.length <= 0) {
            explore_button_on(false);
        }
    };
    all_filter_button.onclick = async () => {
        explore_call(async () => {
            await load_explore_filter({ console: true });
        });
    };
}

/*document.getElementById("greyBackground").addEventListener("click", (e) => { 
    if(e.target === document.getElementById("greyBackground")){ 
      login(0);
    } 
   }); 
//login screen appearance
function login(val) {
    let greyDiv = document.getElementById("greyBackground");
    switch (val) {
        case 0:
            greyDiv.style.display = "none";
            document.getElementById('login').style.display = "none";
            document.getElementById('signup').style.display = "none";
            break;
        case 1:
            greyDiv.style.display = "block";
            document.getElementById('login').style.display = "block";
            break;
        case 2:
            greyDiv.style.display = "block";
            document.getElementById('signup').style.display = "block";
            break;
    }
    if (val===0) {
        
    } else if (val===1) {
        
    }
}*/


async function getData() {
    let d = await fetch("https://"+window.location.hostname+"/thedata");
    if (d.ok) {
        let data = await d.json();
        console.log(data);
        return data;
    } else {
        return [];
    }
}

async function displayCollection() {
    let collectionArr = await getData();
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
                    // fetch(e).then(function(response) {
                    //     return response.blob();
                    // }).then(function(myBlob) {
                    //     var objectURL = URL.createObjectURL(myBlob);
                    //     img.src = objectURL;
                    // });
                    img.src = e;
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