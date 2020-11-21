/**
 * A script which contains methods used to detect collisions between objects
 */

 /*
  a function which calculates and returns sprite corner coordinates using the transformation formula.
  The calculation of coordinates is necessary for applying the point in polygon algorithm
  */
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

 /* collision detection: a function which checks if a corner point is in a polygon
 *  polygon is an array of arrays, and corner point is an array with two values
 *  the function returns true if the corner point is found inside the polygon
 */
function detect_collision(corner, polygon) {
    var x = corner[0], y = corner[1]; 
    var found = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];
        
        var intersection = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersection){
            found = !found;
        } 
    }   
    return found;
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