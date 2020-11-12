/* a file used to retrieve, where possible, data stored as cookies and display that on the canvas*/

// image folder name for re-constructing the image path
const image_folder = "assets";

// a function which gets automatically called as soon as the html document document is ready
// the function restore the user objects on the canvas
$(function(){
     // gather the data from the cookie
     let data = JSON.parse(getCookies());
     // display the data
     if(data != undefined && data.walls != undefined){
         // display walls
         display_walls(data.walls);
     }
     if(data != undefined && data.products != undefined){
        // display products
        display_products(data.products);
     }
});

// a function to display walls data from the cookie on the canvas
function display_walls(walls_data)
{
    // a local variable used to store walls data
    let the_walls = [];

    // clear the canvas if necessary: destroy all the existing walls
    if(walls.length != 0 && (walls_data.length == 4 || walls_data.length == 6)){
        walls.forEach(element => {
            element.wallSprite.destroy();
            element.wallSprite.text.destroy();
        });
        walls = [];
    }
         
    // go through the array of walls data, create new walls, and arrange them in a data structure
    for(let i = 0; i < walls_data.length; ++i){
        // collect wall data
        let the_wall = walls_data[i];
        // create a wall on the canvas and store in an array
        the_walls[i] = new wall(the_wall.x, the_wall.y, the_wall.height, the_wall.width, the_wall.horizontal);
    }

    // when possible, attach the newly created walls from the cookie data
    if(the_walls != undefined && (the_walls.length == 4 || the_walls.length == 6) && walls.length == 0){
        attach_walls(the_walls);
    }
}

// a function to display products from the cookie on the canvas
function display_products(products_data)
{
    // go through the array of product data and create every product on the canvas
    for(let i = 0; i < products_data.length; ++i){
        let product = products_data[i];
        // calculate the coordinates taking into account the rotation angle
        let coordinates = calculate_coordinates(product.angle, product.width/2, product.height/2, product.x, product.y);
        // re-arrange the image path
        product.src = image_folder.concat(product.src);
        // create the product on the canvas
        create_product(product.x, product.y, product_id++, product.width, product.height, coordinates, product.angle, product.src, product.product_db_id);
    }
}