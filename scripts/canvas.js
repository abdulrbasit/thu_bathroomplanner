var graphics = new PIXI.Graphics();

function drawGrid() {
  
    graphics.lineStyle(1, 0x000000, 1);
    for (let xIndex = 0; xIndex <= scWidth - 100; xIndex += cm) {
        graphics.moveTo(xIndex, 0);
        graphics.lineTo(xIndex, scrHeight/2 + 50);
        
    }

    for (let yIndex = 0; yIndex <= scrHeight/2 + 50 ; yIndex += cm) {
        graphics.moveTo(0, yIndex);
        graphics.lineTo(scWidth - 100, yIndex);
    }

    app.stage.addChild(graphics);

}

function clearGrid(){
    graphics.clear();

}

