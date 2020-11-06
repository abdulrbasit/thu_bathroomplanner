/**
 * A script used to drag products to and on the canvas. 
 * In this script, there are two important, parallel arrays: canvas_products and sprites
 * parallel in the sense that for the same id, you get the access the data of the same sprite/product
 * Objects must be moved very slowly on the canvas for optimal results. A red products are products that 
 * collided with other products. Such products must be move backwards or the blocking product must be deleted.
 */

// a color for colliding products
const collision_color = "0xff0002";
const white_color = "0xffffff";
// creat an array for the products added to the canvas: this will be used later
let canvas_products = [];
// store the width and the height of the canvas
let the_canvas_width = app.renderer.width;
let the_canvas_height = app.renderer.height;
// a variable to give an id to canvas products: later use
let product_id = 0;
// a variable to store the id of the clicked product
let the_id='';
// an array to store sprites displayed on the canvas
let sprites = [];
// a variable to store the id of a clicked sprite on the canvas
let sprite_id = -1;
// obtain the array of products from php.
// Send a GET request to the server to obtain the products
// url: php file where the request is sent
// type: type of request
// datatype: type of data that is looked for in the response
var drag_product_products;
let products = drag_product_products.slice();

var drag_product_product_dimensions;

// a function which sets the id of the clicked product
function set_id(value){
    the_id = value;
}

//let drop;
// a function used to drop products on the canvas
function init_draggable() {
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
                drop_product = true;
                drop_wall = true;
               // get mouse position relative to drop target 
               var dropPositionX = event.pageX - $(this).offset().left;
               var dropPositionY = event.pageY - $(this).offset().top;
               // get mouse offset relative to dragged item
               var dragItemOffsetX = event.offsetX;
               var dragItemOffsetY = event.offsetY;
               // get the image of the product from the html document
               var product = document.getElementById(the_id);
               // get position of dragged item relative to drop target and center coordinates
               var positionX = dropPositionX-dragItemOffsetX+product.width/2;
               var positionY = dropPositionY-dragItemOffsetY+product.height/2;
               
               // get a texture of the product image
               var texture = PIXI.Texture.from(product.src);

               let product_width_scaled = 0;
               let product_height_scaled = 0;
                // create a json object with all four coordinates of the product 
                let coordinates = {};
               // attempt to add the product to the array of canvas products
               for(i=0, len=products.length; i<len; ++i){
                   if(products[i].id == the_id){
                       let temp_product = {};
                   // scaled height and width of the product
                    /**
                    * product[i].width is the actual width in centimeters. multiplying it with cm yields the width in pixels.
                    * then multiplying it with the scale scales it (reduces it)
                    */
                    // problem with width and height: width should be the horizontal side; height is the vertical side. it is a standard
                    // for 2D apps. the change should be made in the database
                    product_width_scaled = Math.round((products[i].length * cm) * scale);
                    product_height_scaled = Math.round((products[i].width * cm) * scale);

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

                    // coordinates array of the product to be dropped
                    let dropped_coordinates = [[pixel_positionX, pixel_positionY], [pixel_positionX, pixel_positionY+product_height_scaled],
                    [pixel_positionX+product_width_scaled, pixel_positionY+product_height_scaled],[pixel_positionX+product_width_scaled, pixel_positionY]];

                    for(k = 0; k < canvas_products.length; ++k){
                         // create an array of coordinates for this product on the canvas
                         let canvas_product = [[canvas_products[k].coords.x1, canvas_products[k].coords.y1], [canvas_products[k].coords.x2, canvas_products[k].coords.y2],
                         [canvas_products[k].coords.x3, canvas_products[k].coords.y3], [canvas_products[k].coords.x4, canvas_products[k].coords.y4]];

                         // check if any point of the drop product would land in this canvas product
                         for(i=0; i<dropped_coordinates.length; ++i){
                             if(collision(dropped_coordinates[i], canvas_product)){
                                alert("This drop is not possible.\n Please look for a free area for the drop");
                                 drop_product = false;
                                 break;
                             }
                         }

                         // check if any point of this canvas product would land in the dropped product
                         for(i=0; i<canvas_product.length && drop_product; ++i){
                            if(collision(canvas_product[i], dropped_coordinates)){
                                alert("This drop is not possible.\n Please look for a free area for the drop");
                                drop_product = false;
                                break;
                            }
                        }

                        // check if the dropped product lands across the canvas product
                        // for all the points of the canvas product perform a rectangle check with respect to the dropped product
                        for(i=0; i<canvas_product.length && drop_product; ++i){   
                            if(pixel_positionX + product_width_scaled> canvas_product[i][0] && pixel_positionX < canvas_product[i][0]
                               /* && pixel_positionY + product_height_scaled > canvas_product[i][1] && canvas_product[i][1] + product_height > positionY*/){
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
                    // go through the walls and check if a product is being dropped on top of it
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

                    if(drop_product && drop_wall){
                        // store properties for the products on the canvas
                        temp_product.id = product_id;
                        temp_product.x = pixel_positionX;
                        temp_product.y = pixel_positionY;
                        temp_product.name = products[i].name;
                        temp_product.image = products[i].image;
                        temp_product.width = products[i].width;
                        temp_product.length = products[i].length;
                        // scaled_width: horizontal side of the product on the canvas 
                        // scaled_height: vertical side of the product on the canvas
                        temp_product.scaled_width = product_width_scaled;
                        temp_product.scaled_height = product_height_scaled;
                        // store the coordinates of all 4 corners of the product
                        coordinates.x1 = pixel_positionX;
                        coordinates.y1 = pixel_positionY;
                        coordinates.x2 = pixel_positionX;
                        coordinates.y2 = pixel_positionY + product_height_scaled;
                        coordinates.x3 = pixel_positionX + product_width_scaled;
                        coordinates.y3 = pixel_positionY + product_height_scaled;
                        coordinates.x4 = pixel_positionX + product_width_scaled;
                        coordinates.y4 = pixel_positionY;
                        // the rotation angle of the product: it is 0 at first
                        temp_product.rad_angle = 0;
                        // add the coordinates data to the temp product
                        temp_product.coords = coordinates;
                       // add the dropped product in the list of canvas products
                       canvas_products.push(temp_product);
                    }
                       break;
                   }
               }
               if(drop_product && drop_wall){
                   // create product on the canvas
                   create_product(positionX, positionY, texture, product_id++, product_width_scaled, product_height_scaled, coordinates, 0);
               }
          }
      }
    );
}

// a function to check collisions when a product is being dropped
function drop_products(x1, width1,  y1, height1, x2, width2, y2, height2){
    return ((x1+ width1 > x2) && (x1 < x2))|| 
                        // right side check for the drop
                        (( x2 + width2 > x1) && (x1 >= x2 ))
                        // check for the vertical side of the drop 
                        && ((y1 + height1 > y2) && 
                       ( y2 + height2 > y1));
}

// a constructor for the Sprite with id: useful later for sorting sprites for collisons etc
class Sprite extends PIXI.Sprite {
    constructor(texture, id, coordinates, angle, move) {
      super(texture);
      this.id = id;
      this.coords = coordinates;
      this.rad_angle = angle;
      this.move = move;
    }
}

// a function used to create products on the canvas
function create_product(posX, posY, texture, product_id, product_width_scaled,product_height_scaled, coordinates, angle)
{
    // create a sprite for the product on the canvas
    let product = new Sprite(texture, product_id, coordinates, angle, true);
    // enable the product to be interactive. this will allow it to respond to mouse and touch events
    product.interactive = true;
    // this button mode will mean the hand cursor appears when you roll over the product with your mouse
    product.buttonMode = true;
    // center the product's anchor point
    product.anchor.set(0.5);
    //product.scale.set(1);
    
    // setting the scaled dimensions of the product: the width of the sprite is the horizontal side; 
    //the height is the vertical side. so inverting is required
    product.width = product_width_scaled;
    product.height = product_height_scaled;

    // setup events for dragging and dropping the product
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
        .on('click', store_id)
        .on('touchmove', drag);

    // position of the product on the canvas: coordinates of the center of the sprite
    product.position.x = posX;
    product.position.y = posY;

    // store the sprite in the array of sprites
    sprites.push(product);

    // add it to the stage
    app.stage.addChild(product);
}

// a function which stores the id of the selected sprite
function store_id(){
    sprite_id = this.id;
}

// a function which is called when the sprite is added to the stage
function create(){
     sprite_id = this.id;
    // display the dimensions of the dropped product straight away
    // selected_product.value = this.id;
    update_properties(this.id);
}

// a function which handles the start of the dragging of the product
function start_dragging(event) {
    //Indicator for selected product
    if(sprite_id != this.id){
        for (sprite = 0; sprite < sprites.length; ++sprite) {

            if (sprite_id == sprites[sprite].id) {

                sprites[sprite].tint = 0xffffff;
            }
        }
    }
        this.tint = 0xddddff;
    // when the user clicks on a product, show its dimensions
    //selected_product.value = this.id; 
    // update object properties
    update_properties(this.id);
    // store a reference to the data to track the movement of this particular touch 
    this.data = event.data;
    // make the product semi-transparent when the user starts dragging
    this.alpha = 0.5;
    // enable the dragging of the product
    this.dragging = true;
    // update offsets so the drag starts where the user clicked
    this.offsetX = this.x - this.data.getLocalPosition(this.parent).x;
    this.offsetY = this.y - this.data.getLocalPosition(this.parent).y;
}

// a function which handles the end of the dragging of the product
function stop_dragging()
{
    // make the product non-transparent when the dragging ends
    this.alpha = 1;
    // stop the dragging of the product
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

let blocked_sprites = [];
// a function which handles the dragging of the product on the canvas
function drag()
{
    // a variable to indicate a collision
    let collided = false;

    if (this.dragging && this.move)
    {
        // get the new position of the product
        var newPosition = this.data.getLocalPosition(this.parent);
        // adjust the position of the product on the canvas
        let newPositionX = newPosition.x + this.offsetX;
        let newPositionY = newPosition.y + this.offsetY;

        // calculate half the width and half the height of the image of the product
        let half_width = this.width / 2;
        let half_height = this.height / 2;

        // collision detection and changing the color of the colliding sprite when it occurs
        for(k = 0, length = canvas_products.length; k < length; ++k){
             // create a polygon out of the coordinates of the collided sprite
             let collided_polygon = [[canvas_products[k].coords.x1, canvas_products[k].coords.y1], [canvas_products[k].coords.x2, canvas_products[k].coords.y2],
              [canvas_products[k].coords.x3, canvas_products[k].coords.y3], [canvas_products[k].coords.x4, canvas_products[k].coords.y4]];           
             // coordinate set of the colliding sprite
             let colliding_coordinates = [[this.coords.x1, this.coords.y1], [this.coords.x2, this.coords.y2], [this.coords.x3, this.coords.y3], [this.coords.x4, this.coords.y4]];
             
             // check if the colliding sprite is in the collided sprite
             for(m = 0; m < colliding_coordinates.length; ++m){
                 if( this.id != canvas_products[k].id && collision(colliding_coordinates[m], collided_polygon)){
                     // a collision has been detected here
                     this.tint = collision_color;
                     // block the colliding sprite
                     this.dragging  = false;
                     collided = true;
                     // block the collided sprite
                     sprites[k].move = false;

                     tempo = [this.id, sprites[k].id];
                    // store the index of the blocked, collided sprite
                    blocked_sprites.push(tempo);
                     break;
                 }
             }

             // when necessary, check if the collided sprite is in the colliding sprite
             for(j = 0; j < collided_polygon.length && this.dragging; ++j){
                if( this.id != canvas_products[k].id && collision(collided_polygon[j], colliding_coordinates)){
                    // a collision has been detected here
                    this.tint = collision_color;
                    // block the colliding sprite
                    this.dragging  = false;
                    collided = true;
                    // block the collided sprite
                    sprites[k].move = false;
                    
                    tempo = [this.id, sprites[k].id];
                    // store the index of the blocked, collided sprite
                    blocked_sprites.push(tempo);
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

        // inverse properties if rotation angle is degrees
        if(toDegrees(this.rad_angle) == 90 || toDegrees(this.rad_angle) == 270){
              temp = half_width;
              half_width = half_height;
              half_height = temp;
        }

        // to the left of the canvas
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

        // move the image of the product on the canvas if there are no collisions
        if(this.dragging && !(Math.abs(newPositionX - this.position.x) > cm || Math.abs(newPositionY - this.position.y) > cm)){
            this.position.x = newPositionX;
            this.position.y = newPositionY;
        }
        else{
            this.dragging = true;
        }
 
        // store the coordinates of the moved product on the canvas: for later use
        for(i=0, len=canvas_products.length; i < len; ++i){
            if(canvas_products[i].id == this.id){
                // update the coordinates of the dragged object for the display: top-left corner
               // calculate the new coordinates using the transformation formula
               rad_angle = canvas_products[i].rad_angle;
               canvas_products[i].coords.x1 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (half_height) + newPositionX;
               canvas_products[i].coords.y1 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (half_height) - newPositionY);
               
               canvas_products[i].coords.x2 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (-half_height) + newPositionX;
               canvas_products[i].coords.y2 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (-half_height) - newPositionY);

               canvas_products[i].coords.x3 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (-half_height) + newPositionX;
               canvas_products[i].coords.y3 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (-half_height) - newPositionY);

               canvas_products[i].coords.x4 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (half_height) + newPositionX;
               canvas_products[i].coords.y4 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (half_height) - newPositionY);
               // update the coordinates of the sprite
               this.coords.x1 = canvas_products[i].coords.x1;
               this.coords.y1 = canvas_products[i].coords.y1;
               this.coords.x2 = canvas_products[i].coords.x2;
               this.coords.y2 = canvas_products[i].coords.y2;
               this.coords.x3 = canvas_products[i].coords.x3;
               this.coords.y3 = canvas_products[i].coords.y3;
               this.coords.x4 = canvas_products[i].coords.x4;
               this.coords.y4 = canvas_products[i].coords.y4;
               break;
            }
        }     
        // update properties for the user
        update_properties(this.id);
    }
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
function collision(point, polygon) {

    var x = point[0], y = point[1]; 
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