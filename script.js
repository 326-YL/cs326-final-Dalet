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