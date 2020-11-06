// a function which updates object properties
function update_properties(product_id) {
    // value to indicate that the product was found
    found = false;
    // get the select box
    let selected_product = document.getElementById("selection");
    // get all textarea elements
    let posx = document.getElementById('posx');
    let posy = document.getElementById('posy');
    let width = document.getElementById('width');
    let length = document.getElementById('length');
    // fill the text areas when applicable
    for(i = 0, len = canvas_products.length; i<len; ++i){
            if(product_id == canvas_products[i].id){
                // display the name of the selected product
                selected_product.value = canvas_products[i].name;
                // display the properties of the selected product
                posx.innerHTML = ((canvas_products[i].coords.x1/cm).toFixed(1)) + " cm";
                posy.innerHTML = ((canvas_products[i].coords.y1/cm).toFixed(1)) + " cm";
                width.innerHTML = canvas_products[i].width + " cm";
                length.innerHTML = canvas_products[i].length + " cm";
                found = true;

                break;
            }
    }
    // delete the properties of a deleted product
    if(!found){
        selected_product.value = "";
        posx.innerHTML = "";
        posy.innerHTML = "";
        width.innerHTML = "";
        length.innerHTML = "";
    }
}
