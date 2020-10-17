var graphics = new PIXI.Graphics();

function drawGrid() {
  
    graphics.lineStyle(1, 0x000000, 1);
    // draw vertical lines on the canvas
    for (let xIndex = 0; xIndex <= scWidth; xIndex += cm) {
        graphics.moveTo(xIndex, 0);
        graphics.lineTo(xIndex, scrHeight);
        
    }

    // draw horizontal lines on the canvas
    for (let yIndex = 0; yIndex <= scrHeight ; yIndex += cm) {
        graphics.moveTo(0, yIndex);
        graphics.lineTo(scWidth, yIndex);
    }

    app.stage.addChild(graphics);

}

function clearGrid(){
    graphics.clear();

}
// execute the drawGrid() function
drawGrid();

