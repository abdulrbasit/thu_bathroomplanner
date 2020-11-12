/* Script which processes free rotation with the help of FreeTransformTool*/
var start_position;
var end_position;
var start_angle;
var end_angle;
var delta_angle;
var collision = false;

// Function which checks if the rotation ended with a collision
function rotation_update(){

    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {
            if(check_for_rotation_collision(sprite, end_angle)){
                collision = true;
                sprites[sprite].tint = 0xddddff;
            }
            else {
                // No collision
                collision = false;
                update_coordinates(sprites[sprite].rad_angle, sprite);
            }
            break;
        }
    }
}

// Function which checks detects collision: returns true if there is collision and false if there is not
// sprite_position: position at which the sprite that is being rotated can be found in the list of sprites
// angle: angle at which the rotation currently is or has stopped at
function check_for_rotation_collision(sprite_position, angle){

    let half_width = sprites[sprite_position].width / 2;
    let half_height = sprites[sprite_position].height / 2;
    let coords = calculate_coordinates(angle, half_width, half_height, sprites[sprite_position].x, sprites[sprite_position].y);
    let coordinates = [[coords.x1, coords.y1], [coords.x2, coords.y2], [coords.x3, coords.y3], [coords.x4, coords.y4]];

    for(let k = 0; k < sprites.length; ++k){

        // The sprite cannot collide with itself
        if(sprites[k].id != sprites[sprite_position].id){

            // Create a polygon using the coordinates of this sprite
            let polygon = [[sprites[k].coords.x1, sprites[k].coords.y1],[sprites[k].coords.x2, sprites[k].coords.y2],
            [sprites[k].coords.x3, sprites[k].coords.y3], [sprites[k].coords.x4, sprites[k].coords.y4]];
            
            // Check now if the sprite to be rotated would collide with this sprite
            // Check if a coordinate of this sprite would be in the rotated sprite
            for(let j=0; j < polygon.length; ++j){
                if(detect_collision(polygon[j], coordinates)){
                    // Rotation is not permitted
                    return true;
                }
            }

            // Check if a coordinates of the rotated sprite would land in this sprite
            for(let d=0; d < coordinates.length; ++d){                   
                if(detect_collision(coordinates[d], polygon)){
                    // Rotation is not permitted
                    return true;
                }
            }
        }
    }    
    // Validate the rotation
    return false;
}


// Function which checks for collisions every tick of rotation
function check_for_collisions_while_rotating(){
       
    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {

            app.stage.addChild(sprites[sprite]);
            app.stage.addChild(tool);
            tool.addChild(selectTool);
            if(check_for_rotation_collision(sprite, end_angle)){
                               
                sprites[sprite].tint = collision_color;

            }
            else {
                sprites[sprite].tint = 0xddddff;
            }
            break;
        }
    }

}