/**
 * A script used to drag products to and on the canvas
 */
// a reference to the select box for showing dimensions
let select_box = document.getElementById('objects');
// creat an array for the products added to the canvas: this will be used later
let canvas_products = [];
// store the width and the height of the canvas
let the_canvas_width = app.renderer.width;
let the_canvas_height = app.renderer.height;
// a variable to give an id to canvas products: later use
let product_id = 0;
// a variable to store the id of the clicked product
let the_id='';
// AN ARRAY TO STORE SPRITES DISPLAYED ON THE CANVAS
let sprites = [];
// A VARIABLE TO STORE THE ID OF A CLICKED SPRITE ON THE CANVAS
let sprite_id = -1;
// obtain the array of products from php.
// Send a GET request to the server to obtain the products
// url: php file where the request is sent
// type: type of request
// datatype: type of data that is looked for in the response
let products;

(function ($) {
	$(document).ready(function () {
		$.ajax({
			url: 'getProducts.php',
			type: 'get',
			dataType: 'json',
			success: function (response) {
                products = JSON.parse(JSON.stringify(response));
			}
		});
	});
})(jQuery);

// a function which sets the id of the clicked product
function set_id(value){
    the_id = value;
}

// a function used to drop products on the canvas
$( function() {
    // make products draggable above everything else
    $(".products").draggable(
    {
        helper: 'clone',
        revert: "invalid",
        stack: ".products"
    });
    
    // make the product droppable only on the canvas
    $('#main').droppable(
      {
          // only accept 'products'
          accept: '.products',
          // drop function to determine the position for the drop
          drop: function(event, ui){
               // get mouse position relative to drop target 
               var dropPositionX = event.pageX - $(this).offset().left;
               var dropPositionY = event.pageY - $(this).offset().top;
               // get mouse offset relative to dragged item
               var dragItemOffsetX = event.offsetX;
               var dragItemOffsetY = event.offsetY;
               // get the image of the product from the html document
               var product = document.getElementById(the_id);
               // get position of dragged item relative to drop target and center coordinates
               var positionX = dropPositionX-dragItemOffsetX+product.width/2;
               var positionY = dropPositionY-dragItemOffsetY+product.height/2;
               // get a texture of the product image
               var texture = PIXI.Texture.from(product.src);
               
               // dimensions of the product in centimeters
               let product_width_scaled=0;
               let product_height_scaled=0;

               // add the product to the array of canvas products
               for(i=0, len=products.length; i<len; ++i){
                  // console.log("the product id: "+products[i].id);
                   if(products[i].id == the_id){
                       let temp_product = {};
                       // store properties for the products on the canvas
                       temp_product.id = product_id;
                       temp_product.x = ((positionX - product.width / 2)/cm).toFixed(1);
                       temp_product.y = ((positionY - product.height / 2)/cm).toFixed(1);
                       temp_product.name = products[i].name;
                       temp_product.image = products[i].image;
                       
                       // scaled height and width of the product
                       /**
                        * product[i].width is the actual width in centimeters. multiplying it with cm yields the width in pixels.
                        * then multiplying it with the scale scales it (reduces it)
                        */
                       // problem with width and height: width should be the horizontal side; height is the vertical side. it is a standard
                       // for 2D apps. the change should be made in the database
                       product_width_scaled = Math.round((products[i].length * cm) * scale);
                       product_height_scaled = Math.round((products[i].width * cm) * scale);

                       temp_product.width = products[i].width;
                       temp_product.length = products[i].length;
                       
                       // add the dropped product in the list of canvas products
                       canvas_products.push(temp_product);

                       // add the product to the select box as an option
                       // create a new option element
                       let option = document.createElement('option');
                       // create a text node to add to the option element
                       option.appendChild(document.createTextNode(temp_product.name));
                       // set value property for the option
                       option.value = temp_product.id;
                       // add the option to the select box
                       select_box.appendChild(option);
                       break;
                   }
               }
               // create product on the canvas
               create_product(positionX, positionY, texture, product_id++, product_width_scaled, product_height_scaled);
          }
      }
    );
  } 
);

// a constructor for the Sprite with id: useful later for sorting sprites for collisons etc
class Sprite extends PIXI.Sprite {
    constructor(texture, id) {
      super(texture);
      this.id = id;
    }
}

// a function used to create products on the canvas
function create_product(posX, posY, texture, product_id, product_width_scaled,product_height_scaled)
{
    // create a sprite for the product on the canvas
    let product = new Sprite(texture, product_id);
    // enable the product to be interactive. this will allow it to respond to mouse and touch events
    product.interactive = true;
    // this button mode will mean the hand cursor appears when you roll over the product with your mouse
    product.buttonMode = true;
    // center the product's anchor point
    product.anchor.set(0.5);
    //product.scale.set(1);
    
    // setting the scaled dimensions of the product: the width of the sprite is the horizontal side; 
    //the height is the vertical side. so inverting is required
    product.width = product_width_scaled;
    product.height = product_height_scaled;
    
    // setup events for dragging and dropping the product
    product
        .on('added', create)
        .on('mousedown', start_dragging)
        .on('touchstart', start_dragging)
        // events for drag end
        .on('mouseup', stop_dragging)
        .on('mouseupoutside',stop_dragging)
        .on('touchend', stop_dragging)
        .on('touchendoutside', stop_dragging)
        // events for dragging
        .on('mousemove', drag)
        .on('click', store_id)
        .on('touchmove', drag);

    // position of the product on the canvas
    product.position.x = posX;
    product.position.y = posY;

    // store the sprite
    sprites.push(product);

    // add it to the stage
    app.stage.addChild(product);
}

// A FUNCTION TO STORE THE ID OF THE CLICKED SPRITE
function store_id(){
    sprite_id = this.id;
}

// a function which is called when the sprite is added to the stage
function create(){
    // display the dimensions of the dropped product straight away
    select_box.value = this.id;
    update_properties();
}

// a function which handles the start of the dragging of the product
function start_dragging(event)
{
    // when the user clicks on a product, show its dimensions
    select_box.value = this.id; 
    // update object properties
    update_properties();
    // store a reference to the data to track the movement of this particular touch 
    this.data = event.data;
    // make the product semi-transparent when the user starts dragging
    this.alpha = 0.5;
    // enable the dragging of the product
    this.dragging = true;
    // update offsets so the drag starts where the user clicked
    this.offsetX = this.x - this.data.getLocalPosition(this.parent).x;
    this.offsetY = this.y - this.data.getLocalPosition(this.parent).y;
}

// a function which handles the end of the dragging of the product
function stop_dragging()
{
    // make the product non-transparent when the dragging ends
    this.alpha = 1;
    // stop the dragging of the product
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

// a function which handles the dragging of the product on the canvas
function drag()
{
    if (this.dragging)
    {
        // get the new position of the product
        var newPosition = this.data.getLocalPosition(this.parent);
        // adjust the position the product on the canvas
        let newPositionX = newPosition.x + this.offsetX;
        let newPositionY = newPosition.y + this.offsetY;

        // calculate half the width and half the height of the image of the product
        let half_width = this.width / 2;
        let half_height = this.height / 2;

        // corrections to make it possible for the sprites to slide along the canvas walls. 
        if(newPositionX < half_width){
            newPositionX = half_width;
        }
        if((newPositionX + half_width) > the_canvas_width){
            newPositionX = the_canvas_width - half_width;
        }
        if(newPositionY < half_height){
            newPositionY = half_height;
        }
        if(newPositionY + half_height > the_canvas_height){
            newPositionY = the_canvas_height - half_height;
        }
        
        // move the image of the product on the canvas
        this.position.x = newPositionX;
        this.position.y = newPositionY;

        // store the coordinates of the moved product on the canvas: for later use
        for(i=0, len=canvas_products.length; i < len; ++i){
            if(canvas_products[i].id == this.id){
                // update the coordinates of the dragged object for the display
                canvas_products[i].x = ((newPositionX - half_width)/cm).toFixed(1);
                canvas_products[i].y = ((newPositionY - half_height)/cm).toFixed(1);
            }
        }

        // update properties for the user
        update_properties();
    }
}
