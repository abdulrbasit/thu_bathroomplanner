//Global Variable: cm in pixels.
const cm = 37.79;

//Global Scale Variable
var scale = 1/20;

var scWidth = 0.7 * screen.width;
var scrHeight = 0.7 * screen.height;

//Scale change.
function setScale(newScale){
    scale = newScale;
}

//Global Variable for App.
const app = new PIXI.Application({ transparent: false, backgroundColor : 0xdddddd});

//add canvas to the html document
document.getElementById('main').appendChild(app.view);

//Init screen size.
app.renderer.resize(scWidth, scrHeight);


