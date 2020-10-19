
//Wall array, defined here for scope.

let walls;
//Points (Array for future), defined here for scope.
let points = [interactionPoint(0, 0)];

//Interaction point to resize room layout.
function interactionPoint(x, y) {

      let point = new PIXI.Sprite(PIXI.Texture.WHITE);
      point.anchor.set(0.0);
      point.position.set(x, y);
      point.visible = false;
      point.interactive = true;
      point.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);   
  
   return point;
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

      //vertical scaling
      //If position of pointer changes in y axis move three walls and resize two of them. 
      if((newPosition.y - points[0].y) != 0){
         if(!(newPosition.y >= walls[2].wallSprite.y)){
            //Move three walls.
            walls[0].wallSprite.y +=  newPosition.y - points[0].y;
            walls[1].wallSprite.y +=  newPosition.y - points[0].y;
            walls[3].wallSprite.y +=  newPosition.y - points[0].y;
            //Decrease size of the walls.
            if((newPosition.y - points[0].y) > 0){
             walls[1].wallSprite.height -= newPosition.y - points[0].y;
             walls[3].wallSprite.height -= newPosition.y - points[0].y;
            }else if((newPosition.y - points[0].y) < 0 )
            {
               //Increase size of the walls.
             walls[1].wallSprite.height += points[0].y - newPosition.y;
             walls[3].wallSprite.height += points[0].y - newPosition.y;
          }
          //Move interraction point.
          points[0].y =  newPosition.y;
         }
        
   }
      //Horizontal scaling.
      //If pointer moves in x axis move one wall resize two of the walls.
      if((newPosition.x - points[0].x) != 0){
         if(!(newPosition.x <= walls[3].wallSprite.x)){
         walls[1].wallSprite.x +=  newPosition.x - points[0].x;
         if((newPosition.x - points[0].x) > 0){
          walls[0].wallSprite.width += newPosition.x - points[0].x;
          walls[2].wallSprite.width += newPosition.x - points[0].x;
         }else if((newPosition.x - points[0].x) < 0 )
         {

          walls[0].wallSprite.width -=  points[0].x - newPosition.x;
          walls[2].wallSprite.width -=  points[0].x - newPosition.x;
       }
         
            points[0].x = newPosition.x;
         }
      }
   }
}


function onOver(event){
   //console.log('test');
   this.visible = false;
}

function wall(x,y, height, width, horizontal=true){
   this.x = x;
   this.y = y;

   if(!horizontal){
      [width, height] = [height, width];
   }

   this.height = height;
   this.width = width;

   

   let phics = new PIXI.Graphics();
   //Draw rectangle for wall.
   phics.beginFill(0x00);
   phics.drawRect(0, 0, height, width);
   phics.endFill();

   //Convert it to Sprite.
   let ren = new PIXI.AbstractRenderer();
   let tex = app.renderer.generateTexture(phics);
   let wallSprite = new PIXI.Sprite(tex);
   this.wallSprite = wallSprite;
   wallSprite.x = x;
   wallSprite.y = y;
   wallSprite.interactive = true;
   //If it's clicked on, make the interaction point visible/not visible.
   wallSprite.on('click', function(event) { points[0].visible = !points[0].visible;});
   app.stage.addChild(wallSprite);
}




function drawLayout1(){
   

   let wall1 = new wall(100, 100, 400, cm/2, true);
   let wall2 = new wall(500, 100, 400, cm/2, false);
   let wall3 = new wall(100 + (cm/2), 500, 400, cm/2, true);
   let wall4 = new wall(100, 100+(cm/2), 400, cm/2, false);
   walls = [wall1, wall2, wall3, wall4];
   //Place interaction point.
   points[0].x = 490;
   points[0].y = 110;
   app.stage.addChild(points[0]);
   
}

function getWalls(){
   return walls;
}
