//Global Variable: cm in pixels.
const cm = 37.79;

//Global Scale Variable
var scale = 1/20;

//Scale change.
function setScale(newScale){
    scale = newScale;
}

//Global Variable for App.
const app = new PIXI.Application({ transparent: false, backgroundColor : 0xdddddd, resizeTo: document.getElementById('main') });

//add canvas to the html document
document.getElementById('main').appendChild(app.view);

// an array to store sprites displayed on the canvas
let sprites = [];

