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
        if(Math.cos(sprites[id].rad_angle) == 1){
            sprites[id].rad_angle = 0;
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
    // update sprite coordinates
    sprites[id].coords = calculate_coordinates(rad_angle, half_width, half_height, newPositionX, newPositionY);
    // update displayed properties
    update_properties(sprites[id].id);
}