/*********************************************************************************************************/
/*            PIXI.JS : Creation and Handling of products on canvas                                       */
/* Once the product is dropped on the canvas, it becomes a pixi sprite. So pixi event methods are used to */
/* drag the new sprite around the canvas. In these methods collision prevention between sprites is also   */
/* implemented. sprites are gathered a in data structure, and the id of a selected sprite on the canvas   */
/* is stored in a variable. These two elements are later used to rotate sprites and also delete sprites.  */
/**********************************************************************************************************/

// a constructor for sprites
class Sprite extends PIXI.Sprite 
{
    constructor(texture, id, coordinates, angle, move, product_db_id) 
    {
      super(texture);
      this.id = id;
      this.coords = coordinates;
      this.rad_angle = angle;
      this.move = move;
      this.src;
      this.product_db_id = product_db_id;
    }
}


// a function used to create products on the canvas
function create_product(posX, posY, texture, product_id, product_width_scaled, product_height_scaled, coordinates, angle, src, product_db_id)
{
    // create a sprite for the product on the canvas
    let product = new Sprite(texture, product_id, coordinates, angle, true, product_db_id);

    // enable the product to be interactive. this will allow it to respond to mouse and touch events
    product.interactive = true;
    // this button mode will mean the hand cursor appears when you roll over the product with your mouse
    product.buttonMode = true;
    // center the product's anchor point
    product.anchor.set(0.5);
    let fileNameStart = src.lastIndexOf("/");
    product.src = src.slice(fileNameStart);
    
    // setting the scaled dimensions of the product: the width of the sprite is the horizontal side; 
    // the height is the vertical side. so inverting is required
    product.width = product_width_scaled;
    product.height = product_height_scaled;
  
    // set up events for dragging and dropping the product
    product
        .on('added', create)
        .on('mousedown', start_dragging)
        .on('touchstart', start_dragging)
        // events for drag end
        .on('mouseup', stop_dragging)
        .on('mouseupoutside',stop_dragging)
        .on('touchend', stop_dragging)
        .on('touchendoutside', stop_dragging)
        // events for dragging
        .on('mousemove', drag)
        .on('click', click_product)
        .on('touchmove', drag);

    // position of the product on the canvas: coordinates of the center of the sprite
    product.position.x = posX;
    product.position.y = posY;

    // store the sprite in the array of sprites
    sprites.push(product);

    // add it to the stage
    app.stage.addChild(product);
    product.toString = function () {
        return `{"x": ${this.x}, "y":${this.y}, "src": "${this.src}" , "width":${this.width}, "height": ${this.height}
                 , "angle": ${this.rad_angle} }`;
   }
}

/*** Event functions for dragging sprites */

// a function which stores the id of the selected sprite
function click_product()
{
    sprite_id = this.id;
}

// a function which is called when the sprite is added to the stage
function create()
{
     sprite_id = this.id;
    // display the dimensions of the dropped product straight away 
    update_properties(this.id);
}

// a function which handles the start of the dragging of the product
function start_dragging(event) 
{
    //Indicator for selected product
    if(sprite_id != this.id){
        for (sprite = 0; sprite < sprites.length; ++sprite) {

            if (sprite_id == sprites[sprite].id) {

                sprites[sprite].tint = 0xffffff;
            }
        }
    }
    this.tint = 0xddddff;
    sprite_id = this.id;
    // update object properties: length and width
    update_properties(this.id);
    // store a reference to the data to track the movement of this particular touch 
    this.data = event.data;
    // make the product semi-transparent when the user starts dragging
    this.alpha = 0.5;
    // enable the dragging of the product
    this.dragging = true;
    // update offsets so the dragging starts where the user clicks on the product
    this.offsetX = this.x - this.data.getLocalPosition(this.parent).x;
    this.offsetY = this.y - this.data.getLocalPosition(this.parent).y;
}

// a function which handles the end of the dragging of a product
function stop_dragging()
{
    // make the product non-transparent when the dragging ends
    this.alpha = 1;
    // stop the dragging of the product
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

/** a function which handles the dragging of the product on the canvas*/
function drag()
{
    // a variable to indicate a collision with the red color
    let collided = false;

    if (this.dragging && this.move)
    {
        // get the position of the product sprite
        var newPosition = this.data.getLocalPosition(this.parent);

        // obtain the new centre coodinates of the product sprite
        let newPositionX = newPosition.x + this.offsetX;
        let newPositionY = newPosition.y + this.offsetY;

        // calculate half the width and half the height of the  product sprite
        let half_width = this.width / 2;
        let half_height = this.height / 2;
        
        // obtain this colliding sprite and gather its coordinates
        let sprite;
        let colliding_coordinates = [];
        // make sure the sprite exist on the canvas before trying to use for collision detection
        for(let z = 0; z < sprites.length; ++z){
            if(sprites[z].id == this.id){
                sprite = sprites[z];
                colliding_coordinates = [[sprite.coords.x1, sprite.coords.y1], [sprite.coords.x2, sprite.coords.y2], [sprite.coords.x3, sprite.coords.y3], [sprite.coords.x4, sprite.coords.y4]];
            }
        }
        // collision detection: in case a collision occurs, block the collided sprite and make the colliding sprite red
        for(k = 0, length = sprites.length; k < length; ++k){
             // gather the coordinates of the collided sprite
             let collided_polygon = [[sprites[k].coords.x1, sprites[k].coords.y1], [sprites[k].coords.x2, sprites[k].coords.y2],
              [sprites[k].coords.x3, sprites[k].coords.y3], [sprites[k].coords.x4, sprites[k].coords.y4]];           
             
             // collision detection: check if the colliding sprite is colliding the collided sprite (point in polygon)
             for(m = 0; m < colliding_coordinates.length; ++m){
                if( this.id != sprites[k].id && detect_collision(colliding_coordinates[m], collided_polygon)){ 
                    // collision has been detected: change color of this colliding sprite
                    this.tint = collision_color;
                    // block the colliding sprite
                    this.dragging  = false;
                    collided = true;
                    // block the collided sprite
                    sprites[k].move =false;
                    let temp = [this.id, sprites[k].id];
                    // store the index of the blocked, collided sprite
                    blocked_sprites.push(temp);
                    break;
                 }
             }

             // when necessary, check if the collided sprite is in the colliding sprite
             for(j = 0; j < collided_polygon.length && this.dragging && colliding_coordinates.length > 0; ++j){
                if( this.id != sprites[k].id && detect_collision(collided_polygon[j], colliding_coordinates)){
                    // a collision has been detected here
                    this.tint = collision_color;
                    // block the colliding sprite
                    this.dragging  = false;
                    collided = true;
                    // block the collided sprite
                    sprites[k].move = false;        
                    let temp = [this.id, sprites[k].id];
                    // store the index of the blocked, collided sprite
                    blocked_sprites.push(temp);
                    break;
                }
            }
        }
         // change the color back to white after the collision
        if(!collided){
            this.tint = white_color; 
        }

        // release the blocked sprites if it still exists
        if(this.dragging){
          for(k = 0; k < blocked_sprites.length; ++k){
             for(i = 0; i < sprites.length; ++i){
                   if( this.id == blocked_sprites[k][0] && sprites[i].id == blocked_sprites[k][1]){
                        sprites[i].move = true;
                        break;
                   }
             }
          }
        }

        // distance for the square-shaped images: calculate inclined distances for squre sprites
        if(half_width == half_height && this.rad_angle != 0 && Math.abs(this.rad_angle) != Math.abs(toRadians(180))
        && Math.abs(this.rad_angle) != Math.abs(toRadians(90)) && Math.abs(this.rad_angle) != Math.abs(toRadians(270))){
                // calculate the side which may hit the canvas bother for a certain non-straight angle
                let side = Math.sqrt(2 * Math.pow(half_width, 2));
                half_width = side;
                half_height = side;
        }

        /** walls-products collision implementation: The idea is that products will get very lightly blocked by walls.
         * Products will still be able to go through walls.
         */
        // collision between the top wall and a moving product on the canvas
        if((this.rad_angle == 0 || Math.abs(this.rad_angle) == Math.abs(toRadians(180))) && newPositionY - half_height < walls[0].wallSprite.y + walls[0].wallSprite.height
        && newPositionY - half_height > walls[0].wallSprite.y + walls[0].wallSprite.height/2){
                newPositionY = walls[0].wallSprite.y + walls[0].wallSprite.height + half_height;
        }else if(this.rad_angle != 0 && Math.abs(this.rad_angle) != Math.abs(toRadians(180)) && newPositionY - half_width < walls[0].wallSprite.y + walls[0].wallSprite.height
            && newPositionY - half_width > walls[0].wallSprite.y + walls[0].wallSprite.height/2){
             newPositionY = walls[0].wallSprite.y + walls[0].wallSprite.height + half_width;
        }
        // collision between the bottom wall and a moving product on the canvas
        if((this.rad_angle == 0 || Math.abs(this.rad_angle) == Math.abs(toRadians(180))) && newPositionY + half_height > walls[2].wallSprite.y &&
            newPositionY + half_height < walls[2].wallSprite.y + walls[2].wallSprite.height/2){
                newPositionY = walls[2].wallSprite.y - half_height;
        }else if(this.rad_angle != 0 && Math.abs(this.rad_angle) != Math.abs(toRadians(180)) && newPositionY + half_width > walls[2].wallSprite.y &&
            newPositionY + half_width < walls[2].wallSprite.y + walls[2].wallSprite.height/2){
                newPositionY = walls[2].wallSprite.y - half_width;
        }
        // inverse product dimensions if 90 degree angle has been achieved
        if(Math.abs(toDegrees(this.rad_angle)) == 90 || Math.abs(toDegrees(this.rad_angle)) == 270){
                    temp = half_width;
                    half_width = half_height;
                    half_height = temp;
        }
        // mild collision between the right wall and a moving product on the canvas
        if(newPositionX + half_width > walls[1].wallSprite.x - walls[1].wallSprite.height && newPositionX + half_width < walls[1].wallSprite.x - walls[1].wallSprite.height/2){
            newPositionX = walls[1].wallSprite.x -walls[1].wallSprite.height - half_width;
        }
        // mild collision between the left wall and a moving product on the canvas
        if(newPositionX - half_width < walls[3].wallSprite.x && newPositionX - half_width > walls[3].wallSprite.x - walls[3].wallSprite.height/2){
                newPositionX = walls[3].wallSprite.x + half_width;
        }
        // mild collision between the small, horizontal wall and a moving product on the canvas
        if(walls.length > 4 && newPositionX + half_width > walls[4].wallSprite.x){
                if((this.rad_angle == 0 || Math.abs(this.rad_angle) == Math.abs(toRadians(180))) && (newPositionY + half_height > walls[4].wallSprite.y && newPositionY + half_height < walls[4].wallSprite.y + walls[4].wallSprite.height/2)){
                        newPositionY = walls[4].wallSprite.y - half_height;
                }                     
                else if(this.rad_angle != 0 && Math.abs(this.rad_angle) != Math.abs(toRadians(180)) && newPositionY + half_width > walls[4].wallSprite.y && newPositionY + half_width < walls[4].wallSprite.y + walls[4].wallSprite.height/2){
                        newPositionY = walls[4].wallSprite.y - half_width;
                }
        }
        // mild collision between the small, vertical wall and a moving product on the canvas
        if(walls.length > 4 && newPositionY + half_height > walls[5].wallSprite.y){
            if(newPositionX + half_width > walls[5].wallSprite.x - walls[5].wallSprite.height && newPositionX + half_width < walls[5].wallSprite.x - walls[5].wallSprite.height/2){
                   newPositionX = walls[5].wallSprite.x -walls[5].wallSprite.height - half_width;
            }
        }

        // simple adjustments for the canvas: to the left of the canvas
        if(newPositionX < half_width){
            newPositionX = half_width;
        }
        // to the right of the canvas
        if((newPositionX + half_width) > the_canvas_width){
            newPositionX = the_canvas_width - half_width;
        }
        // to the top of the canvas
        if(newPositionY < half_height){
            newPositionY = half_height;
        }
        // to the bottom of the canvas
        if(newPositionY + half_height > the_canvas_height){
            newPositionY = the_canvas_height - half_height;
        }

        // update the center coordinates: move the image of the product on the canvas if there are no collisions
        if(this.dragging && !(Math.abs(newPositionX - this.position.x) > cm || Math.abs(newPositionY - this.position.y) > cm)){
            this.position.x = newPositionX;
            this.position.y = newPositionY;
        }
        else{
            this.dragging = true;
        }
 
        // update the coordinate of the product being dragged on the canvas via the sprites array
        for(let y=0; y < sprites.length; ++y){
            // make sure you find the element in the array of existing sprites
            if(sprites[y].id == this.id){
                let halfwidth = sprites[y].width / 2;
                let halfheight = sprites[y].height / 2;
                let the_rad_angle = sprites[y].rad_angle;
                // update coordinates
                sprites[y].coords = calculate_coordinates(the_rad_angle, halfwidth, halfheight, newPositionX, newPositionY);
                break;
            }
        }    

        // update properties for the user
        update_properties(this.id);
    }
}

/*********************************************************************************/
/*                  Javascript: Some Important Functions                         */
/*********************************************************************************/

// a function which sets the id of the clicked product
function set_id(value, dimension_id){
    the_product_id = value;
    the_dimension_id = dimension_id;
}

// a function which converts from degrees to radians
function toRadians(angle){
    return (angle * Math.PI)/180;
}

// a function which converts to degrees
function toDegrees(angle){
    return (angle * 180)/Math.PI;
}

/** collision detection: a function which checks if a point is in a polygon
 * polygon is an array of array, and point is a array with two points
 * the function returns true if the point is found inside the polygon
 */
function detect_collision(coordinate, polygon) {

    var x = coordinate[0], y = coordinate[1]; 
    var found = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) found = !found;
    }   
    return found;
}

// a function which calculates and returns sprite corner coordinates using the transformation formula
function calculate_coordinates(rad_angle, half_width, half_height, newPositionX, newPositionY){
    let coordinates = {};
    // calculate coordinates using the transformation formula
    coordinates.x1 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (half_height) + newPositionX;
    coordinates.y1 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (half_height) - newPositionY);
    
    coordinates.x2 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (-half_height) + newPositionX;
    coordinates.y2 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (-half_height) - newPositionY);

    coordinates.x3 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (-half_height) + newPositionX;
    coordinates.y3 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (-half_height) - newPositionY);

    coordinates.x4 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (half_height) + newPositionX;
    coordinates.y4 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (half_height) - newPositionY);
    // return the coordinates as json object
    return coordinates;
}
