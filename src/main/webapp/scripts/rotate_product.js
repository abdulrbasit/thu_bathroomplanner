/**
 * A script used to rotate selected products on the canvas
 * cleansing is still required
 */
// rotation angles
const right_angle = -45;
const left_angle = 45;
let rotate_factor = Math.PI * 2;

// handle left rotation when button is clicked 
$("#btn-rotate-left").on('click', function (event) {

    rotate_left();

});

// handle right rotation when button is clicked
$("#btn-rotate-right").on('click', function (event) {

    rotate_right();

});


// a function which rotates product to left: rotation angle is 45 degrees
function rotate_left() {
    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {
            if(prevent_rotation_collision(sprites[sprite], left_angle)){
                selected_product = sprites[sprite];
                // center the sprite's anchor point
                selected_product.anchor.set(0.5);
                // rotate selected product to left
                selected_product.rotation -= rotate_factor * 0.125;
    
                // update rotation angle
                update_angle(left_angle, sprite);  
            }
            else{
                alert("the rotation by 45° is not possible\n as it would land the product on another element");
            }
            break;
        }
    }
}

// a function which rotates product to right: rotation angle: -45 degrees 
function rotate_right() {
    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {
            if(prevent_rotation_collision(sprites[sprite], right_angle)){
                selected_product = sprites[sprite];
                // center the sprite's anchor point
                selected_product.anchor.set(0.5);
                // rotate selected product to right
                selected_product.rotation += rotate_factor * 0.125;
                // update rotation angle
                 update_angle(right_angle, sprite);  
            }
           else{
                alert("the rotation by -45° is not possible\n as it would land the product on another element");
            }
            break;
        }
    }
}

// a function to updates angle details
function update_angle(angle, id){
        // update the rotation angle for the sprite
        let rad_angle = toRadians(angle);
        // cumulatively store the rotation angle of a given sprite
        sprites[id].rad_angle += rad_angle;
        canvas_products[id].rad_angle += rad_angle;
        if(Math.cos(canvas_products[id].rad_angle) == 1){
            sprites[id].rad_angle = 0;
            canvas_products[id].rad_angle = 0;
        }
        // calculate and store the new coordinates 
        update_coordinates(canvas_products[id].rad_angle, id);
}

// a function to calculate new coordinates of sprites/products
function update_coordinates(rad_angle, id){
    // coordinates of center of the sprites
    let newPositionX = sprites[id].x;
    let newPositionY = sprites[id].y;
    // half width and half height of the product/sprite
    let half_width = sprites[id].width / 2;
    let half_height = sprites[id].height / 2;
    // update canvas products coordinates: needed for collisions
    canvas_products[id].coords.x1 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (half_height) + newPositionX;
    canvas_products[id].coords.y1 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (half_height) - newPositionY);
    
    canvas_products[id].coords.x2 = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (-half_height) + newPositionX;
    canvas_products[id].coords.y2 = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (-half_height) - newPositionY);

    canvas_products[id].coords.x3 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (-half_height) + newPositionX;
    canvas_products[id].coords.y3 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (-half_height) - newPositionY);

    canvas_products[id].coords.x4 = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (half_height) + newPositionX;
    canvas_products[id].coords.y4 = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (half_height) - newPositionY);

    // update sprites data: for collision dection
    sprites[id].coords.x1 = canvas_products[id].coords.x1;
    sprites[id].coords.y1 = canvas_products[id].coords.y1;
    sprites[id].coords.x2 = canvas_products[id].coords.x2;
    sprites[id].coords.y2 = canvas_products[id].coords.y2;
    sprites[id].coords.x3 = canvas_products[id].coords.x3;
    sprites[id].coords.y3 = canvas_products[id].coords.y3;
    sprites[id].coords.x4 = canvas_products[id].coords.x4;
    sprites[id].coords.y4 = canvas_products[id].coords.y4;

    // update displayed properties
    update_properties(sprites[id].id);
}

// a function which prevents a rotation if it is going to land the product on another product 
// or if it is going land the product outside of the canvas. the passed sprite represents the sprite that wants to rotate
function prevent_rotation_collision(sprite, deg_angle){
    // convert the angle to radians
    let angle = toRadians(deg_angle);
    // rotation angle for the center of the rectangular used as the origin.
    let rad_angle = sprite.rad_angle + angle;
    //console.log("the angle is: "+toDegrees(rad_angle));
    let half_width = sprite.width / 2;
    let half_height = sprite.height / 2;
    
     // create another polygon make of the (future) rotated values of the sprite to be rotated
    let value1x = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (half_height) + sprite.position.x;
    let value1y = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (half_height) - sprite.position.y);

    let value2x = Math.cos(rad_angle) * (-half_width) - Math.sin(rad_angle) * (-half_height) + sprite.position.x;
    let value2y = Math.abs(Math.sin(rad_angle) * (-half_width) + Math.cos(rad_angle) * (-half_height) - sprite.position.y);

    let value3x = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (-half_height) + sprite.x;
    let value3y = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (-half_height) - sprite.position.y);

    let value4x = Math.cos(rad_angle) * (half_width) - Math.sin(rad_angle) * (half_height) + sprite.position.x;
    let value4y = Math.abs(Math.sin(rad_angle) * (half_width) + Math.cos(rad_angle) * (half_height) - sprite.position.y);

    let coordinates = [[value1x, value1y], [value2x, value2y],  [value3x, value3y], [value4x, value4y]];
    // make sure that after the rotation the sprite is not landing on another object
    for(let k = 0; k < sprites.length; ++k){
            // the sprite cannot collide with itself
            if(sprites[k].id != sprite.id){
                 // create a polygon using the coordinates of this sprite
                 let polygon = [[sprites[k].coords.x1, sprites[k].coords.y1],[sprites[k].coords.x2, sprites[k].coords.y2],
                 [sprites[k].coords.x3, sprites[k].coords.y3], [sprites[k].coords.x4, sprites[k].coords.y4]];
                 // check now if the sprite to be rotated would collide with this sprite
                 // check if a coordinate of this sprite would be in the rotated sprite
                 for(let j=0; j < polygon.length; ++j){
                     if(collision(polygon[j], coordinates)){
                         // rotation is not permitted
                         return false;
                     }
                 }
                 // check if a coordinates of the rotated sprite would land in this sprite
                 for(let d=0; d < coordinates.length; ++d){                   
                     if(collision(coordinates[d], polygon)){
                          // rotation is not permitted
                          return false;
                      }
                  }

            }
    }
    // check if the sprite would land on a wall
    for(let i = 0; i < coordinates.length; ++i){
        // top wall
        if(walls[0].wallSprite.y + walls[0].wallSprite.height > coordinates[i][1]){
               return false;
        }
        // right wall
        else if(walls[1].wallSprite.x - cm/2 < coordinates[i][0]){
            return false;
        }
        // bottom wall
        else if(walls[2].wallSprite.y < coordinates[i][1]){
             return false;
        }
        // left wall
        else if(walls[3].wallSprite.x > coordinates[i][0]){
               return false;
        }
        
        // small horizontal wall
        else if(walls.length > 4 && walls[4].wallSprite.y < coordinates[i][1] && (walls[5].wallSprite.x - cm/2) < coordinates[i][0]){
               return false;
        }
        // small vertical wall
        else if(walls.length > 4 && walls[5].wallSprite.x - cm/2 < coordinates[i][0] && coordinates[i][1] > walls[5].wallSprite.y){
            return false;
        }
    }
        // checks for wall 5 and 6
        if(walls.length > 4){
            // get the wall polygon
            for(u = 4; u < 6; ++u){
                let wall_polygon = get_wall_polygon(u);
                // check for hidden collision with walls 5 and 6
                for(let v = 0; v < coordinates.length; ++v){
                    if(collision(coordinates[v], wall_polygon)){
                        return false;
                    }
                }
                for(let v = 0; v < wall_polygon.length; ++v){
                    if(collision(wall_polygon[v], coordinates)){
                        return false;
                    }
                }

            }
        } 
    // if the execution reaches here, then the rotation can go ahead
    return true;
}
