/****************************************************************** */
/* A script used to rotate selected products on the canvas.         */
/* The script is also use to detect and prevent rotation collisions.*/
/********************************************************************/

// rotation angles
let rotate_factor = Math.PI * 2;
// angle: 45°
const radians = 0.125;
const right_angle = -45;
const left_angle = 45;

// handle left rotation when button is clicked 
$("#btn-rotate-left").on('mousedown', function (event) {

    rotate_left();

});

// handle right rotation when button is clicked
$("#btn-rotate-right").on('mousedown', function (event) {

    rotate_right();

});

// a function which rotates product to left: rotation angle is 45 degrees
function rotate_left() {
    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {
            if(prevent_rotation_collision(sprite, left_angle)){
                selected_product = sprites[sprite];
                // center the sprite's anchor point
                selected_product.anchor.set(0.5);
                // rotate selected product to left
                selected_product.rotation -= rotate_factor * 0.125;  
                // update rotation angle by passing the rotation angle and the sprite id
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
            if(prevent_rotation_collision(sprite, right_angle)){
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

// a function to updates angle details: the angle and the sprite id are passed
function update_angle(angle, id){
        // update the rotation angle for the sprite
        let rad_angle = toRadians(angle);
        // cumulatively store the rotation angle of a given sprite
        sprites[id].rad_angle += rad_angle;

        // canvas_products[id].rad_angle += rad_angle;

        if(Math.cos(sprites[id].rad_angle) == 1){
            sprites[id].rad_angle = 0;
            // canvas_products[id].rad_angle = 0;
        }
        // calculate and store the new coordinates 
        update_coordinates(sprites[id].rad_angle, id);
}

/* a function to calculate new coordinates of sprites/products using the transformation formula after
 * the rotation has been successful */
function update_coordinates(rad_angle, id){
    // coordinates of center of the sprites
    let newPositionX = sprites[id].x;
    let newPositionY = sprites[id].y;
    // half width and half height of the product/sprite
    let half_width = sprites[id].width / 2;
    let half_height = sprites[id].height / 2;
    // update canvas products coordinates: needed for collisions
    // update canvas products and sprite coordinates

    // canvas_products[id].coords = calculate_coordinates(rad_angle, half_width, half_height, newPositionX, newPositionY);

    sprites[id].coords = calculate_coordinates(rad_angle, half_width, half_height, newPositionX, newPositionY);
    // update displayed properties
    update_properties(sprites[id].id);
}

// a function which prevents a rotation if it is going to land the product on another product 
// or if it is going land the product outside of the canvas. the passed sprite represents the sprite that wants to rotate
function prevent_rotation_collision(sprite_index, deg_angle){
    // convert the angle to radians
    let angle = toRadians(deg_angle);
    // rotation angle for the center of the rectangular used as the origin.
    let rad_angle = sprites[sprite_index].rad_angle + angle;
    //console.log("the angle is: "+toDegrees(rad_angle));
    let half_width = sprites[sprite_index].width / 2;
    let half_height = sprites[sprite_index].height / 2;

    // create another polygon make of the (future) rotated values of the sprite to be rotated
    let coords = calculate_coordinates(rad_angle, half_width, half_height, sprites[sprite_index].x, sprites[sprite_index].y);
    let coordinates = [[coords.x1, coords.y1], [coords.x2, coords.y2], [coords.x3, coords.y3], [coords.x4, coords.y4]];
    // make sure that after the rotation the sprite is not landing on another object
    for(let k = 0; k < sprites.length; ++k){
        // the sprite cannot collide with itself
        if(sprites[k].id != sprites[sprite_index].id){
            // create a polygon using the coordinates of this sprite
            let polygon = [[sprites[k].coords.x1, sprites[k].coords.y1],[sprites[k].coords.x2, sprites[k].coords.y2],
            [sprites[k].coords.x3, sprites[k].coords.y3], [sprites[k].coords.x4, sprites[k].coords.y4]];
            // check now if the sprite to be rotated would collide with this sprite
            // check if a coordinate of this sprite would be in the rotated sprite
            for(let j=0; j < polygon.length; ++j){
                if(detect_collision(polygon[j], coordinates)){
                    // rotation is not permitted
                    return false;
                }
            }
            // check if a coordinates of the rotated sprite would land in this sprite
            for(let d=0; d < coordinates.length; ++d){                   
                if(detect_collision(coordinates[d], polygon)){
                    // rotation is not permitted
                    return false;
                }
            }
        }
    }    
    // validate the rotation
    return true;
}
