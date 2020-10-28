/**
 * A script used to delete selected products on the canvas
 */

 
$("#btn-delete-product").on('click', function(event){
 
delete_product();

});

// a function which deletes a selected product
function delete_product() {
    // delete selected product
    var i;

    for(i = 0; i < sprites.length; ++i){
            if(sprite_id == sprites[i].id){
                app.stage.removeChild(sprites[i]);
                sprites.splice(i, 1);
                canvas_products.splice(i, 1);

            }
    }
}