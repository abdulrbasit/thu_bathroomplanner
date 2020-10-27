// a function which updates object properties
function update_properties() {
    // get the select box
    let selection = document.getElementById("objects");
    // get all textarea elements
    let posx = document.getElementById('posx');
    let posy = document.getElementById('posy');
    let width = document.getElementById('width');
    let length = document.getElementById('length');
    // fill the text areas when applicable
    for(i = 0, len = canvas_products.length; i<len; ++i){
            if(selection.value == canvas_products[i].id){
                posx.innerHTML = canvas_products[i].x + " cm";
                posy.innerHTML = canvas_products[i].y + " cm";
                width.innerHTML = canvas_products[i].width + " cm";
                length.innerHTML = canvas_products[i].length + " cm";
                break;
            }
    }
}

// handle changes in the select box
$( "#objects" ).change(function() {
    update_properties();
});