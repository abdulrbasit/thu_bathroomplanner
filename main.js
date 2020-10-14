// Main javascript file

// canvas attributes 
let canvas_width = 1000;
let canvas_height = 590;
tilesize = 100;

// create a canvas object: width: 1000, height: 590
const canvas = new PIXI.Application({
width: canvas_width,
height: canvas_height,
antialias: true,
transparent: false, 
backgroundColor : 0xdddddd}
);
document.body.appendChild(canvas.view);

// center and style the canvas in the window
canvas.view.style.position = 'absolute';
canvas.view.style.left = '55%';
canvas.view.style.top = '50.5%';
canvas.view.style.transform = 'translate3d( -50%, -50%, 0 )';
canvas.view.style.border = 'solid 2px black';

// create a graphics object to draw tiles on the canvas
var graphics = new PIXI.Graphics();

// set the line style
graphics.lineStyle(1, 0x000000, 1);

// draw vertical lines on the canvas
for (let x = tilesize; x < canvas_width; x += tilesize) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, canvas_height);
    
}

// draw horizontal lines on the canvas
for (let y = tilesize; y < canvas_width; y += tilesize) {
    graphics.moveTo(0, y);
    graphics.lineTo(canvas_width, y);
    
}

// add the graphics object to the canvas
canvas.stage.addChild(graphics);

// sample methods for dragging and dropping an object on the canvas
function newObject(params) {
    const a = document.querySelector("li")
    var objectValue =a.getAttribute('data-value');
    console.log(objectValue);
    var sprite = PIXI.Sprite.from(objectValue);
    sprite.x = 100;
    sprite.y = 100;
    sprite.anchor.set(0.5);
   // sprite.height = 90;
    //sprite.width = 90;
    sprite.scale.x = 0.5;
    sprite.scale.y = 0.5;
    // Opt-in to interactivity
    sprite.interactive = true;

    // Shows hand cursor
    sprite.buttonMode = true;

        // Pointers normalize touch and mouse
    sprite.on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
    console.log(sprite);
    app.stage.addChild(sprite);
}


function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

