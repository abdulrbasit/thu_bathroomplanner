const squareX = new PIXI.Sprite(PIXI.Texture.BLACK);

function wallSprInit(){
   let wallSprite = new PIXI.Sprite(PIXI.Texture.BLACK);
   wallSprite.factor = 1;
   wallSprite.anchor.set(0.5);
   wallSprite.position.set(100, 100);

    return wallSprite;
}


function interactionPoint(x, y) {
   let point = new PIXI.Sprite(PIXI.Texture.WHITE);
   //point.tint = 0x000000;
   //point.factor = 2;
   point.anchor.set(0.5);
  point.height = 20;
  point.width = 20;
  point.position.set(x, y);
  point.visible = false;
   return point;
}

function wall(x,y, width, height=cm/2, horizontal=true){
   let wallSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
   this.wallSprite = wallSprite;
   wallSprite.tint = 0x000000;
   wallSprite.factor = 2;
   //wallSprite.anchor.set(0.5);
   wallSprite.position.set(x, y);
   wallSprite.height = height;
   wallSprite.width = width;
   this.height = height;
   this.width = width;
   app.stage.addChild(wallSprite);
   wallSprite.anchor.set(0.5)
   if(horizontal){
      
      let point1 = new interactionPoint(x - width / 2 + 20, y);
      this.point1 = point1;
      app.stage.addChild(point1);
   
      let point2 = new interactionPoint(x, y);
      this.point2 = point2;
      app.stage.addChild(point2);
   
      let point3 = new interactionPoint(x + width / 2 - 20, y);
      this.point3 = point3;
      app.stage.addChild(point3);
   }else{
      wallSprite.height = width;
      wallSprite.width = height;
      this.height = width;
      this.width = height;
      app.stage.addChild(wallSprite);
      let point1 = new interactionPoint(x, y  - width / 2 + 20);
      this.point1 = point1;
      app.stage.addChild(point1);

      let point2 = new interactionPoint(x, y);
      this.point2 = point2;
      app.stage.addChild(point2);

      let point3 = new interactionPoint(x , y + width / 2 - 20);
      this.point3 = point3;
      app.stage.addChild(point3);
   }

}

function drawLayout1(){
   let wall1 = new wall(300,300, 400, cm/2, false);
   let wall2 = new wall(492, 100, 400, cm/2, true);
   let wall3 = new wall(685,300, 400, cm/2, false);
   let wall4 = new wall(492, 500, 400, cm/2, true);
}