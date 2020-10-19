//Global Variable: cm in pixels.
const cm = 37.79;

//Global Scale Variable
var scale = 1/100;

var scWidth = 0.7 * screen.width + 90;
var scrHeight = screen.height - 270;

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
app.renderer.resize(scWidth * 0.8, scrHeight*0.7);

drawLayout1();
