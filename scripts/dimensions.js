// identifier for the bathroom layout

// display the scale
let scaling = document.getElementById('scale');
scaling.innerHTML = scale.toFixed(2);

// a function which updates object properties
function update_properties() {
    
// get the select box
let selection = document.getElementById("objects");
// get all textarea elements
let posx = document.getElementById('posx');
let posy = document.getElementById('posy');
let width = document.getElementById('width');
let height = document.getElementById('height');
// get the value of the first option of the select box
let bathroom_layout = select_box.options[0].value;
    // fill the text areas when applicable
    if(selection.value == bathroom_layout){
          posx.innerHTML = (((walls[0].wallSprite.x)/cm)-0.5).toFixed(1) + " cm"; 
          posy.innerHTML = ((walls[0].wallSprite.y)/cm).toFixed(1) + " cm"; 
          width.innerHTML = wall_width; 
          height.innerHTML = wall_height;
    }else{
        for(i = 0, len = canvas_products.length; i<len; ++i){
            if(selection.value == canvas_products[i].id){
                posx.innerHTML = canvas_products[i].x + " cm";
                posy.innerHTML = canvas_products[i].y + " cm";
                width.innerHTML = canvas_products[i].width + " cm";
                height.innerHTML = canvas_products[i].height + " cm";
                break;
            }
        }
    }
  }

  /// JQuery: call the update_properties funciton as soon as the document is ready
  $( document ).ready(function() {
    update_properties();
 });

 /// setting the scale
 $('#scale').keydown(function (event) {
    let keyPressed = event.keyCode || event.which;
    if (keyPressed === 13) {
        // prevent a new line
        event.preventDefault();
        // update the scale variable
        scale = scaling.value;
    }
});