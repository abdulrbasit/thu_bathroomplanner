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


//Init screen size.
// app.renderer.resize(document.getElementById('main').offsetWidth - 50, document.getElementById('main').offsetHeight- 50 ) ;


