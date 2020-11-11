/***************************************************************************************************************/
/* Dragging and handling of canvas products                                                                    */
/* A script used to drag products to and on the canvas.                                                        */
/* In this script, first of all, the dragging and dropping of a product on the canvas is handle by JQuery.     */
/* The JQuery droppable function also ensure that a product cannot be dropped on top existing elements on      */
/* on the canvas. This prevents collisions from happening as the user populate the canvas.                     */
/* Once the product is dropped on the canvas, it becomes a pixi sprite. So pixi event methods are used to      */
/* drag the new sprite around the canvas. In these methods collision prevention between sprites is also        */
/* implemented. sprites are gathered a in data structure, and the id of a selected sprite on the canvas        */
/* is stored in a variable. These two elements are later used to rotate sprites and also delete sprites.       */
/***************************************************************************************************************/

/*********************************************************************************/
/*        Javascript: Declaration of constants and global variables              */
/*********************************************************************************/

// a color for colliding products
const collision_color = "0xff0002";
const white_color = "0xffffff";
// creat an array for the products added to the canvas: this will be used later
let canvas_products = [];
// an array to store sprites displayed on the canvas
let sprites = [];
// a function which stores sprites blocked by collisions
let blocked_sprites = [];
// store the width and the height of the canvas
let the_canvas_width = app.renderer.width;
let the_canvas_height = app.renderer.height;

// variables to store details on products
var drag_product_products;
var drag_product_product_dimensions;
// a variable to give an id to canvas products: later use
let product_id = 0;
// a variable to store the id of the clicked product
let the_product_id='';
let the_dimension_id = '';

// a variable to store the id of the current sprite
let sprite_id = -1;


/*********************************************************************************/
/*             JQUERY : Drag and drop concept                                    */
/*********************************************************************************/

// a function used to drop products on the canvas
function init_draggable() 
{
    // make products draggable above everything else
    $(".products").draggable(
    {
        helper: 'clone',
        revert: "invalid",
        stack: ".products"
    });
    
    // make the product droppable only on the canvas
    $('#main').droppable(
      {
         // only accept 'products'
          accept: '.products',
          // drop function to determine the position for the drop
          drop: function(event, ui){
                // enable the drop of the product on the canvas
               let drop_product = true;
               let drop_wall = true;
               let found_product = false;  
               // real product dimensions
               let product_width_scaled = 0;
               let product_height_scaled = 0;
               // create a json object with all four coordinates of the product 
               let coordinates = {};
               // get mouse position relative to drop target 
               var dropPositionX = event.pageX - $(this).offset().left;
               var dropPositionY = event.pageY - $(this).offset().top;
               // get mouse offset relative to dragged item
               var dragItemOffsetX = event.offsetX;
               var dragItemOffsetY = event.offsetY;
               // get the image of the product from the html document
               var product = document.getElementById(the_product_id);
               // get position of dragged item relative to drop target and center coordinates
               var positionX = dropPositionX-dragItemOffsetX+product.width/2;
               var positionY = dropPositionY-dragItemOffsetY+product.height/2;
               
               // get a texture of the product image
               var texture = PIXI.Texture.from(product.src);

               // attempt to add the product to the array of canvas products
               for(i=0, length=drag_product_product_dimensions.length; i < length; ++i){
                   // retrieve the selected product and its dimensions
                    if(drag_product_product_dimensions[i]['product_id'] == the_product_id && drag_product_product_dimensions[i]['id'] == the_dimension_id){
                        let temp_product = {};
                        /* product[i].width is the actual width in centimeters. multiplying it with cm yields the width in pixels.
                        * then multiplying it with the scale scales it (reduces it): scaled height and width of the product
                        */
                        product_width_scaled = Math.round((drag_product_product_dimensions[i]['length'] * cm) * scale);
                        product_height_scaled = Math.round((drag_product_product_dimensions[i]['width'] * cm) * scale);

                        // dropped product pixel coordinates: top-left corner
                        let pixel_positionX = positionX - (product_width_scaled / 2);
                        let pixel_positionY = positionY - (product_height_scaled / 2);

                        // corrections: make sure the drop takes place on the canvas
                        if(pixel_positionX < 0){
                            positionX -= pixel_positionX;
                            pixel_positionX = positionX - (product_width_scaled / 2);
                        }
                        else if(pixel_positionX + product_width_scaled > canvas_width){
                            positionX -= pixel_positionX + product_width_scaled - canvas_width;
                            pixel_positionX = positionX - (product_width_scaled / 2);
                        }
                        if(pixel_positionY<0){
                            positionY -= pixel_positionY;
                            pixel_positionY = positionY - (product_height_scaled / 2);
                        }
                        else if(pixel_positionY + product_height_scaled > canvas_height){
                            positionY -= pixel_positionY + product_height_scaled - canvas_height + 5;
                            pixel_positionY = positionY - (product_height_scaled / 2);
                        }

                        // coordinates array of the product to be dropped on the canvas: two-dimensional array
                        let dropped_coordinates = [[pixel_positionX, pixel_positionY], [pixel_positionX, pixel_positionY+product_height_scaled],
                        [pixel_positionX+product_width_scaled, pixel_positionY+product_height_scaled],[pixel_positionX+product_width_scaled, pixel_positionY]];

                        // collision detection: detect if a product is about to be placed on another element on the canvas, and react
                        for(k = 0; k < sprites.length; ++k){
                             // create an array of coordinates for this product on the canvas
                             let canvas_product = [[sprites[k].coords.x1, sprites[k].coords.y1], [sprites[k].coords.x2, sprites[k].coords.y2],
                             [sprites[k].coords.x3, sprites[k].coords.y3], [sprites[k].coords.x4, sprites[k].coords.y4]];

                             // check if any point of the drop product would land in this canvas product
                             for(y=0; y<dropped_coordinates.length; ++y){
                                 if(detect_collision(dropped_coordinates[y], canvas_product)){
                                    alert("This drop is not possible.\n Please look for a free area for the drop");
                                    drop_product = false;
                                     break;
                                }
                            }

                            // check if any angle of this canvas product would land in the dropped product
                            for(z=0; z<canvas_product.length && drop_product; ++z){
                                if(detect_collision(canvas_product[z], dropped_coordinates)){
                                    alert("This drop is not possible.\n Please look for a free area for the drop");
                                    drop_product = false;
                                    break;
                                }
                            }

                            // check if the dropped product lands across the canvas product
                            // for all the points of the canvas product perform a rectangle check with respect to the dropped product
                            for(t=0; t<canvas_product.length && drop_product; ++t){   
                                if(pixel_positionX + product_width_scaled> canvas_product[t][0] && pixel_positionX < canvas_product[t][0]){
                                    let count1 = 0;
                                    let count2 = 0;
                                    for(d = 0; d < canvas_product.length; ++d){
                                        if(pixel_positionY > canvas_product[d][1]){
                                             count1++;
                                        }
                                    }
                                    for(d = 0; d < canvas_product.length; ++d){
                                        if(pixel_positionY < canvas_product[d][1]){
                                             count2++;
                                        }
                                    }
                                    if(count1 == 2 && count2 == 2){
                                            alert("This drop is impossible.\n Please look for a free area for the drop");
                                            drop_product = false;
                                            break;
                                    }
                                }
                            }
                        }

                        // check if a product is being dropped on top of a wall
                        for(k=0, length=walls.length; k < length; ++k){
                            let wall_width = walls[k].wallSprite.width;
                            let wall_height = walls[k].wallSprite.height;
                            if(k == 1 || k == 3){
                                // swap to adapt to the logic used in the 'walls' script
                                wall_width = walls[k].wallSprite.height;
                                wall_height = walls[k].wallSprite.width;
                            }
                        // left-side check for the drop
                            if( ((pixel_positionX + product_width_scaled > walls[k].wallSprite.x && pixel_positionX < walls[k].wallSprite.x)
                                // right side check for the drop
                                ||(walls[k].wallSprite.x + wall_width > pixel_positionX && pixel_positionX > walls[k].wallSprite.x)) &&
                                // vertical check for the drop
                                (pixel_positionY + product_height_scaled > walls[k].wallSprite.y && walls[k].wallSprite.y + wall_height > pixel_positionY) ){
                                        alert("you cannot drop a product on a wall.\nPlease look for a free area for the drop");
                                        drop_wall = false;
                                        break;
                            }
                        }
                        for(let q = 0; q < drag_product_products.length; ++q){
                       
                            if(the_product_id == drag_product_products[q]["id"] && drop_product && drop_wall){
                                // store properties for the products on the canvas
                                temp_product.id = product_id;
                                temp_product.x = pixel_positionX;
                                temp_product.y = pixel_positionY;

                                // gather this data for display to the left of the screen
                                temp_product.name = drag_product_products[q]['name'];
                                temp_product.image = drag_product_products[q]['image'];
                                temp_product.width = drag_product_product_dimensions[i]['width'];
                                temp_product.length = drag_product_product_dimensions[i]['length'];

                                // store the coordinates of all 4 corners of the product
                                coordinates.x1 = pixel_positionX;
                                coordinates.y1 = pixel_positionY;
                                coordinates.x2 = pixel_positionX;
                                coordinates.y2 = pixel_positionY + product_height_scaled;
                                coordinates.x3 = pixel_positionX + product_width_scaled;
                                coordinates.y3 = pixel_positionY + product_height_scaled;
                                coordinates.x4 = pixel_positionX + product_width_scaled;
                                coordinates.y4 = pixel_positionY;
                                // add the dropped product in the list of canvas products. this array does not contain pixels of the sprite
                                canvas_products.push(temp_product);

                                // indicate that the product was added to the canvas_products. so it can be dropped.
                                found_product = true;
                                break;
                            }
                        }
                        break;
                    } 
               }
               if(found_product && drop_product && drop_wall){
                   // create the product on the canvas
                   create_product(positionX, positionY, texture, product_id++, product_width_scaled, product_height_scaled, coordinates, 0, the_product_id);
               }
          }
      }
    );
}

/*********************************************************************************/
/*            PIXI.JS : Creation and Handling of products on canvas              */
/*********************************************************************************/

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
      this.product_db_id = product_db_id;
    }
}


// a function used to create products on the canvas
function create_product(posX, posY, texture, product_id, product_width_scaled, product_height_scaled, coordinates, angle, product_db_id)
{
    // create a sprite for the product on the canvas
    let product = new Sprite(texture, product_id, coordinates, angle, true, product_db_id);

    // enable the product to be interactive. this will allow it to respond to mouse and touch events
    product.interactive = true;
    // this button mode will mean the hand cursor appears when you roll over the product with your mouse
    product.buttonMode = true;
    // center the product's anchor point
    product.anchor.set(0.5);
    
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
}

/*** Event functions for dragging sprites */

// a function which stores the id of the selected sprite
function click_product()
{
    sprite_id = this.id;
    console.log("the id is: " + sprite_id);
    // the db id of the product is:
    console.log("db is: "+this.product_db_id);

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
 
        // update the coordinate of the product being dragged on the canvas
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
