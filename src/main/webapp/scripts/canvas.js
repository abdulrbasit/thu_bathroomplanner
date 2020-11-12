let graphics = new PIXI.Graphics();
// canvas dimensions
let canvas_height = document.getElementById('main').offsetHeight;
let canvas_width = document.getElementById('main').offsetWidth * 2;
function drawGrid() {
    // unselect the rotate tool (in case it was selected)
    selectTool.unselect();
    canvas_height = document.getElementById('main').offsetHeight;
    canvas_width = document.getElementById('main').offsetWidth * 2;
    graphics.lineStyle(1, 0x000000, 1);
    // draw vertical lines on the canvas
    for (let xIndex = 0; xIndex <= document.getElementById('main').offsetWidth*2; xIndex += cm) {
        graphics.moveTo(xIndex, 0);
        graphics.lineTo(xIndex, document.getElementById('main').offsetHeight);
        
    }

    // draw horizontal lines on the canvas
    for (let yIndex = 0; yIndex <= document.getElementById('main').offsetHeight * 2; yIndex += cm) {
        graphics.moveTo(0, yIndex);
        graphics.lineTo(document.getElementById('main').offsetWidth, yIndex);
    }
    

    app.stage.addChild(graphics);
    if(sprites.length > 0){
        for (let index = 0; index < sprites.length; index++) {
            app.stage.removeChild(sprites[index]);
            app.stage.addChild(sprites[index]);
        }
        
    }

}

function clearGrid(){
    graphics.clear();

}
// execute the drawGrid() function
window.addEventListener('resize', drawGrid);
drawGrid();

