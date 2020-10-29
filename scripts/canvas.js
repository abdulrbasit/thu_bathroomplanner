let graphics = new PIXI.Graphics();

function drawGrid() {
  
    graphics.lineStyle(1, 0x000000, 1);
    // draw vertical lines on the canvas
    for (let xIndex = 0; xIndex <= document.getElementById('main').offsetWidth*2; xIndex += cm) {
        graphics.moveTo(xIndex, 0);
        graphics.lineTo(xIndex, document.getElementById('main').offsetHeight);
        
    }

    // draw horizontal lines on the canvas
    for (let yIndex = 0; yIndex <= document.getElementById('main').offsetHeight*2 ; yIndex += cm) {
        graphics.moveTo(0, yIndex);
        graphics.lineTo(document.getElementById('main').offsetWidth, yIndex);
    }

    app.stage.addChild(graphics);

}

function clearGrid(){
    graphics.clear();

}
// execute the drawGrid() function
drawGrid();

