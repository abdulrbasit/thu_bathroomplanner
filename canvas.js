
const app = new PIXI.Application({ transparent: false, backgroundColor : 0xdddddd});
document.body.appendChild(app.view);

app.renderer.resize(802, 602);

var graphics = new PIXI.Graphics();

graphics.lineStyle(1, 0x000000, 1);


for (let x = 1; x <= 801; x += 100) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, 600);
    
}

for (let y = 1; y <= 801; y += 100) {
    graphics.moveTo(0, y);
    graphics.lineTo(800, y);
    
}

app.stage.addChild(graphics);

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
