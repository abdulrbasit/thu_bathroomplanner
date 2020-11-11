// a function which updates object properties
function update_properties(product_id) {
    // value to indicate that the product was found
    found = false;
    // get the select box
    let selected_product = document.getElementById("selection");
    // get all textarea elements
    let width = document.getElementById('width');
    let length = document.getElementById('length');
    // fill the text areas when applicable
    for(i = 0, len = canvas_products.length; i<len; ++i){
            if(product_id == canvas_products[i].id){
                // display the name of the selected product
                selected_product.innerHTML = canvas_products[i].name;
                // display the properties of the selected product
                width.innerHTML = canvas_products[i].width;
                length.innerHTML = canvas_products[i].length;
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
