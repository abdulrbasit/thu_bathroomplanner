/**
 * A script used to delete selected products on the canvas
 */
 
$("#btn-delete-product").on('click', function(event){
 
    selectTool.unselect();
    delete_product();
    
    });
    
// a function which deletes a selected product
function delete_product() {
    // delete selected product
    var sprite;
    
    for(sprite = 0; sprite < sprites.length; ++sprite){
        if(sprite_id == sprites[sprite].id){
            if(confirm("Are you sure you want to delete this product?")){
                app.stage.removeChild(sprites[sprite]);
                sprites.splice(sprite, 1);
                // delete the properties of the deleted product
                update_properties(sprite_id);
                sprite_id = -1;
            }
        }
    }
}