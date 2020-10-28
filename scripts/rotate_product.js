/**
 * A script used to rotate selected products on the canvas
 */

// handle left rotation when button is clicked 
$("#btn-rotate-left").on('click', function (event) {

    rotate_left();

});

// handle right rotation when button is clicked 
$("#btn-rotate-right").on('click', function (event) {

    rotate_right();

});

let rotate_factor = Math.PI * 2;

// a function which rotates product to left
function rotate_left() {
    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {
            
            selected_product = sprites[sprite];
            // center the sprite's anchor point
            selected_product.anchor.set(0.5);
            // rotate selected product to left
            selected_product.rotation -= rotate_factor * 0.125;
        }
    }
}

// a function which rotates product to right
function rotate_right() {
    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {
            selected_product = sprites[sprite];
            // center the sprite's anchor point
            selected_product.anchor.set(0.5);
            // rotate selected product to right
            selected_product.rotation += rotate_factor * 0.125;
        }
    }
}
