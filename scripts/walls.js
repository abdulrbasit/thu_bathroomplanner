// Wall array, defined here for scope.
let walls;

//Points (Array for future), defined here for scope.
let points = [];

// a variable to display the area of a text
let area_text = new PIXI.Text("", {fontFamily: "Arial", fontSize : "22px", fontWeight: "normal"});

//Interaction point to resize room layout.
function interactionPoint(sprite) {

      let phics = new PIXI.Graphics();

      //Draw rectangle for wall.
      phics.lineStyle(2, 0xFFFFFF, 1);
      phics.drawRect(0, 0, sprite.width, sprite.height);
     //phics.endFill();
      //Convert it to Sprite.
      let ren = new PIXI.AbstractRenderer();
      let tex = app.renderer.generateTexture(phics);

      let wallLines = new PIXI.Sprite(tex);
      this.wallLines = wallLines;
      wallLines.sprite = sprite;

      wallLines.x = sprite.x;
      wallLines.y = sprite.y;

      if(!sprite.horizontal){
         this.wallLines.rotation = (Math.PI/180) *90;
      }
      wallLines.interactive = true;
      app.stage.addChild(this.wallLines);
      wallLines.anchor.set(0.0);
      wallLines.interactive = true;
      wallLines.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove)
      .on('click', function(event){ this.destroy();});
 //  return point;
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
      let attachedWalls = this.sprite.getAttachedWalls();
      if(this.sprite.horizontal){ //if this wall is horizontal
         attachedWalls.forEach(verticalWall => {
            if(!verticalWall.horizontal){ //move & resize the vertical walls,
               if(newPosition - this.y != 0){
                  if(newPosition.y < this.y){ //If sprite moved upwards
                     //if anchor sprite is below the walls
                  if(verticalWall.wallSprite.y < this.sprite.y){
                        //decrease the length
                        verticalWall.wallSprite.width -= this.y - newPosition.y ;
                    //    verticalWall.wallSprite.text.y -= this.y - newPosition.y;
                  //if it is above the walls move the walls upwards and increase the length
                  }else if(verticalWall.wallSprite.y > this.sprite.y){
                     verticalWall.wallSprite.y -=  this.y  - newPosition.y;
                     verticalWall.wallSprite.width += this.y - newPosition.y;
                  }

               }else if(newPosition.y > this.y){ //if the anchor sprite moved downwards
                  //if anchor is below the walls
                  if(verticalWall.wallSprite.y < this.sprite.y){
                  //   verticalWall.wallSprite.y = newPosition.y;
                     //increase the size
                     verticalWall.wallSprite.width += newPosition.y - this.sprite.y ;
                    // verticalWall.wallSprite.text.y += newPosition.y - this.y;
                  }else if(verticalWall.wallSprite.y >= this.y){ //if the anchor lines are above the walls
                     //move the walls downwards and decrease the size
                     verticalWall.wallSprite.y += newPosition.y - this.y;
                   //  console.log(verticalWall.wallSprite.text.;
                    // verticalWall.wallSprite.text.y += newPosition.y - this.y;
                     verticalWall.wallSprite.width -= newPosition.y - this.y ;
                  }
               }
               }
               verticalWall.wallSprite.text.y = (verticalWall.wallSprite.width / 2) + verticalWall.wallSprite.y;
               verticalWall.wallSprite.text.text = ((verticalWall.wallSprite.width/cm)  /scale).toFixed(2)  + " cm";
               //verticalWall.wallSprite.text.updateText();
               //verticalWall.wallSprite.text.visible = false;
            }
         });
         this.y = newPosition.y;
         this.sprite.text.y = this.y - 25;
         this.sprite.y = newPosition.y;
      }
      if(!(this.sprite.horizontal)){ //if this wall is vertical
         let test = 0;
         attachedWalls.forEach(horizantalWall => {
            //move and resize horizantal walls
            if(horizantalWall.horizantal){
               //If moved on x
               if (newPosition.x - this.x != 0) {
                  //if moved to the left
                  if (newPosition.x - this.x < 0) {
                     //if selected anchor is on the left side of horizontal walls
                     if (this.sprite.x <= horizantalWall.wallSprite.x ) {
                        test = cm/2;
                        //Move horizontal walls to the left and increase their size
                        horizantalWall.wallSprite.x -= this.x - newPosition.x;
                        horizantalWall.wallSprite.width += this.x - newPosition.x; //+ test;
                     }//if selected anchor is on the right side of horizontal walls
                     else if((this.sprite.x > horizantalWall.wallSprite.x )){
                        //decrease size
                        test = 0;
                        horizantalWall.wallSprite.width -= this.x - newPosition.x;
                     }
                  }//If selected anchor moved to the right
                  else if (newPosition.x - this.x > 0) {
                     //if selected anchor is on the left side of horizontal walls
                     if (this.sprite.x <= horizantalWall.wallSprite.x ) {
                        test = cm/2;
                        //Move horizontal walls to the right and decrease their size
                        horizantalWall.wallSprite.x += newPosition.x - this.x;
                        horizantalWall.wallSprite.width -= newPosition.x - this.x; //+ test;
                     }//if selected anchor is on the right side of horizontal walls
                     else if((this.sprite.x > horizantalWall.wallSprite.x )){
                        //decrease size
                        test = 0;
                        horizantalWall.wallSprite.width += newPosition.x - this.x;
                     }
                  }
               }
            }
            horizantalWall.wallSprite.text.x = (horizantalWall.wallSprite.width / 2) + horizantalWall.wallSprite.x;
            horizantalWall.wallSprite.text.text = ((horizantalWall.wallSprite.width/cm) /scale).toFixed(2)  + " cm";
         });
         this.x = newPosition.x ;
         this.sprite.text.x = this.x + 10;
         this.sprite.x = newPosition.x;
      }
      // display the area of the room
      displayArea();
   }
}


function onOver(event){
   this.visible = false;
}

// a constructor for the wall
function wall(x,y, height, width, horizontal){
   this.x = x;
   this.y = y;

   // if(!horizontal){
   //    [width, height] = [height, width];
   // }

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


   this.wallSprite.attached = [];
   this.wallSprite.horizontal = horizontal;
   this.horizantal = horizontal;
   let text = new PIXI.Text(((height/cm) / scale).toFixed(2)  + " cm", {fontSize : "12px"});
   text.x = x + (height /2) ;// + width/2 - 10;
   text.y = y - 25;
   if(!horizontal){
      wallSprite.rotation = (Math.PI/180) *90;
      text.x = x + 10;
      text.y = y + (height / 2);
   }
   wallSprite.text = text;

   app.stage.addChild(wallSprite.text);

  // var wsp = this.wallSprite;
   //If it's clicked on, make the interaction point visible/not visible.
   wallSprite.on('click', function(event) { 
      // points[0].visible = !points[0].visible;
      // if(points[0].visible)
      let point1 = new interactionPoint(this);
   });

   app.stage.addChild(wallSprite);

   this.setText = function(text){
      this.wallSprite.text = text;
   }

   this.attachWall = function(wall){
      this.wallSprite.attached.push(wall);
   }
   this.wallSprite.getAttachedWalls = function(){
      return this.attached;
   }
}




function drawroomLayout_1(){

   //top
   let wall1 = new wall(100, 100, 400, cm/2, true);
   //right
   let wall2 = new wall(500 + (cm/2), 100, 400, cm/2, false);
   wall2.attachWall(wall1);
   wall1.attachWall(wall2);

   //bottom
   let wall3 = new wall(100, 500 - (cm/2), 400, cm/2, true);
   wall3.attachWall(wall2);

   wall2.attachWall(wall3);

   //left
   let wall4 = new wall(100,  100, 400, cm/2, false);
   wall4.attachWall(wall1);
   wall4.attachWall(wall3);

   wall1.attachWall(wall4);
   wall3.attachWall(wall4);
   walls = [wall1, wall2, wall3, wall4];

   // display the area of the room
   displayArea();
}

function drawroomLayout_2(){

   //top
   let wall1 = new wall(100, 100, 600, cm/2, true);

   //right
   let wall2 = new wall(700 + (cm/2), 100, 400, cm/2, false);
   wall2.attachWall(wall1);
   wall1.attachWall(wall2);

   //bottom
   let wall3 = new wall(100, 700 - (cm/2), 400, cm/2, true);
   //left
   let wall4 = new wall(100,  100, 600, cm/2, false);
   wall4.attachWall(wall1);
   wall4.attachWall(wall3);
   wall3.attachWall(wall4);
   wall1.attachWall(wall4);
   //bottom middle
   let wall5 = new wall(500 + (cm/2),  500, 200, cm/2, true);
   wall5.attachWall(wall2);
   wall2.attachWall(wall5);

   //right middle
   let wall6 = new wall(500 + (cm/2),  500, 200, cm/2, false);
   wall6.attachWall(wall3);
   wall6.attachWall(wall5);
   wall3.attachWall(wall6);
   wall5.attachWall(wall6);
   walls = [wall1, wall2, wall3, wall4, wall5, wall6];

   // display the area
   displayArea();
}

function getWalls(){
   return walls;
}

// a function to display the area of the bathroom in the center of the  bathroom
function displayArea(){
      // coordinates of the text to be displayed in the center of the room
      let x = ((walls[0].wallSprite.x)) + (((walls[0].wallSprite.width))/2) - 2 * cm;
      let y = (((walls[0].wallSprite.y)) + ((walls[3].wallSprite.width))/2) - (cm/2);
      // dimensions of the room
      let width = (((walls[0].wallSprite.width)/cm)/scale).toFixed(2);
      let length = (((walls[3].wallSprite.width)/cm)/scale).toFixed(2);
      // calculate the area
      let area = (width * length * (1/10000)).toFixed(2);
      // set the area to be displayed
      area_text.text = ("Area: " + area + " \u33A1");
      // set position of the text
      area_text.position.set(x,y);
      // display message
      app.stage.addChild(area_text);
}

drawroomLayout_2();

$(".roomLayout").on('click', function(event){
   event.stopPropagation();
   if(walls.length != 0){
      walls.forEach(element => {
         element.wallSprite.destroy();
         element.wallSprite.text.destroy();
      });
   }
   let func = "draw" + event.target.id + "();";
   eval(func);
});
