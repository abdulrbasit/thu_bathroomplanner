// a function which updates object properties
function update_properties(product_id) {
    // value to indicate that the product was found
    found = false;
    // get the html element whose id is selection
    let selected_product = document.getElementById("selection");
    // get all text area elements
    let width = document.getElementById('width');
    let length = document.getElementById('length');
    // fill the text areas when applicable
    for(i = 0; sprites != undefined && i < sprites.length; ++i){
            if(product_id == sprites[i].id){
                // display the name of the selected product
                selected_product.innerHTML = sprites[i].name;
                // display the properties of the selected product
                width.innerHTML = sprites[i].real_width;
                length.innerHTML = sprites[i].real_length;
                found = true;
                break;
            }
    }
    // delete the properties of a deleted product
    if(!found){
        selected_product.innerHTML = "No selection";
        width.innerHTML = "0";
        length.innerHTML = "0";
    }
}
