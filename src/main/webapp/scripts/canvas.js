let graphics = new PIXI.Graphics();
// canvas dimensions
let canvas_height = document.getElementById('main').offsetHeight;
let canvas_width = document.getElementById('main').offsetWidth;
function drawGrid() {
  
    graphics.lineStyle(1, 0x000000, 1);
    // draw vertical lines on the canvas
    for (let xIndex = 0; xIndex <= canvas_width*2; xIndex += cm) {
        graphics.moveTo(xIndex, 0);
        graphics.lineTo(xIndex, canvas_height);
        
    }

    // draw horizontal lines on the canvas
    for (let yIndex = 0; yIndex <= canvas_height*2 ; yIndex += cm) {
        graphics.moveTo(0, yIndex);
        graphics.lineTo(canvas_width, yIndex);
    }

    app.stage.addChild(graphics);

}

function clearGrid(){
    graphics.clear();

}
// execute the drawGrid() function
window.addEventListener('resize', drawGrid);
drawGrid();

