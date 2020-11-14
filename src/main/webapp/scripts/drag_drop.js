/***************************************************************************************************************/
/* Dragging and handling of canvas products                                                                    */
/* A script used to drag products to and on the canvas.                                                        */
/* In this script, the dragging and dropping of a product on the canvas is handle by JQuery.                   */
/* The JQuery droppable function also ensure that a product cannot be dropped on top existing elements on      */
/* on the canvas. This prevents collisions from happening as the user populate the canvas.                     */
/***************************************************************************************************************/

/*********************************************************************************/
/*        Javascript: Declaration of constants and global variables              */
/*********************************************************************************/

// a color for colliding products
const collision_color = "0xff0002";
const white_color = "0xffffff";
const selection_color = "0xddddff";
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
               let product_properties = {};

               // attempt to add the product to the array of canvas products
               for(i=0, length=drag_product_product_dimensions.length; i < length; ++i){
                   // retrieve the selected product and its dimensions
                    if(drag_product_product_dimensions[i]['product_id'] == the_product_id && drag_product_product_dimensions[i]['id'] == the_dimension_id){
                        /* product[i].width is the actual width in centimeters. multiplying it with cm yields the width in pixels.
                        * then multiplying it with the scale scales it (reduces it): scaled height and width of the product
                        */
                        product_width_scaled = Math.round((drag_product_product_dimensions[i]['length'] * cm) * scale);
                        product_height_scaled = Math.round((drag_product_product_dimensions[i]['width'] * cm) * scale);

                        // dropped product pixel coordinates: top-left corner
                        let pixel_positionX = positionX - (product_width_scaled / 2);
                        let pixel_positionY = positionY - (product_height_scaled / 2);

                        // adjustments: make sure the drop takes place on the visible area of the canvas
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
                        
                        // store properties of the product
                        for(let q = 0; q < drag_product_products.length; ++q){
                       
                            if(the_product_id == drag_product_products[q]["id"] && drop_product && drop_wall){
                                // gather the properties of product
                                product_properties.name = drag_product_products[q]['name'];
                                product_properties.image = drag_product_products[q]['image'];
                                product_properties.real_width = drag_product_product_dimensions[i]['width'];
                                product_properties.real_length = drag_product_product_dimensions[i]['length'];

                                // store the coordinates of all 4 corners of the rectangular product
                                coordinates = compute_coordinates(pixel_positionX, pixel_positionY, product_width_scaled, product_height_scaled);

                                // indicate that the product was found and that its properties were gathered
                                found_product = true;
                                break;
                            }
                        }

                        break;
                    } 
               }
               
               if(found_product && drop_product && drop_wall){
                   // create the product on the canvas
                   create_product(positionX, positionY, product_id++, product_width_scaled, product_height_scaled, coordinates, 0, the_product_id, product_properties);
               }
          }
      }
    );
}

/*********************************************************************************/
/*                        Javascript functions                                   */
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

// a function which calculates and returns sprite corner coordinates using the transformation formula
function calculate_coordinates(rad_angle, half_width, half_height, centerX, centerY){
    let coordinates = {};
    // calculate coordinates using the transformation formula
    coordinates.x1 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (half_height) + centerX;
    coordinates.y1 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (half_height) - centerY);
    
    coordinates.x2 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (-half_height) + centerX;
    coordinates.y2 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (-half_height) - centerY);

    coordinates.x3 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (-half_height) + centerX;
    coordinates.y3 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (-half_height) - centerY);

    coordinates.x4 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (half_height) + centerX;
    coordinates.y4 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (half_height) - centerY);
    // return the coordinates as json object
    return coordinates;
}

// a function used to calculate the initial coordinates of the 4 corners of the product
function compute_coordinates(pixel_positionX, pixel_positionY, product_width_scaled, product_height_scaled){
    let coordinates = {};
    coordinates.x1 = pixel_positionX;
    coordinates.y1 = pixel_positionY;
    coordinates.x2 = pixel_positionX;
    coordinates.y2 = pixel_positionY + product_height_scaled;
    coordinates.x3 = pixel_positionX + product_width_scaled;
    coordinates.y3 = coordinates.y2;
    coordinates.x4 = coordinates.x3;
    coordinates.y4 = pixel_positionY;
    return coordinates;
}