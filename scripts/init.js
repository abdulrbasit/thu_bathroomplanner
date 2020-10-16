//Global Variable: cm in pixels.
const cm = 37.79;

//Global Scale Variable
var scale = 1/100;

var scWidth = screen.width;
var scrHeight = screen.height;

//Scale change.
function setScale(newScale){
    scale = newScale;
}

//Global Variable for App.
const app = new PIXI.Application({ transparent: false, backgroundColor : 0xdddddd});

//Add app to screen.
//Example canvas appending to div:
document.getElementById('main').appendChild(app.view);

//document.body.appendChild(app.view);

//Init screen size.
app.renderer.resize(scWidth - 100, scrHeight/2 + 50);

drawGrid();

drawLayout1();
