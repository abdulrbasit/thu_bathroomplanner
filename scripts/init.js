//Global Variable: cm in pixels.
const cm = 37.79;

//Global Scale Variable
var scale = 1/100;

var scWidth = 0.7 * screen.width + 90;
var scrHeight = screen.height - 270;

/*var scWidth = 1300;
var scrHeight = 1070;*/

//Scale change.
function setScale(newScale){
    scale = newScale;
}

//Global Variable for App.
const app = new PIXI.Application({ transparent: false, backgroundColor : 0xdddddd});

// position the canvas on the screen
app.view.style.position = 'absolute';
app.view.style.left = '60%';
app.view.style.top = '51%';
app.view.style.transform = 'translate3d( -50%, -50%, 0 )';
app.view.style.border = 'solid 2px black';


//Add app to screen.
//Example canvas appending to div:
document.getElementById('main').appendChild(app.view);

//document.body.appendChild(app.view);

//Init screen size.
app.renderer.resize(scWidth, scrHeight);
