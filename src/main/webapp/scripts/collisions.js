/**
 * A script which contains methods used to detect collisions between objects
 */

 /* collision detection: a function which checks if a point is in a polygon
 *  polygon is an array of array, and point is a array with two points
 *  the function returns true if the point is found inside the polygon
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
    // make sure that after the rotation the sprite is not landing on another product
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
