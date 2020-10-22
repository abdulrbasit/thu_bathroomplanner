/**
 * A script used to drag products to and on the canvas
 */

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
                console.log("Successfully loaded products.");
                products = JSON.parse(JSON.stringify(response));
			}
		});
	});
})(jQuery);

//let products = JSON.parse( document.getElementById('json_products').innerHTML );

// creat an array for the products added to the canvas: this will be used later
let canvas_products = [];
// store the width and the height of the canvas
let the_canvas_width = app.renderer.width;
let the_canvas_height = app.renderer.height;
// a variable to give an id to canvas products: later use
let product_id = 0;

// a variable to store the id of the clicked product
let the_id='';
// a function which sets the id of the clicked product
function set_id(value){
    the_id = value;
}

// JQuery: a function used to drop products on the canvas
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
               // get the clicked product
               var product = document.getElementById(the_id);
               // get position of dragged item relative to drop target and center coordinates
               var positionX = dropPositionX-dragItemOffsetX+product.width/2;
               var positionY = dropPositionY-dragItemOffsetY+product.height/2;
               // get a texture of the product image
               var texture = PIXI.Texture.from(product.src);
               // create product on the canvas
               create_product(positionX, positionY, texture, product_id);
               // add the product to the array of canvas products
               for(i=0, len=products.length; i<len; ++i){
                   if(products[i].id == the_id){
                       let temp_product = {};
                       temp_product.id = product_id;
                       temp_product.x = Math.round(positionX - product.width / 2);
                       temp_product.y = Math.round(positionY - product.height / 2);
                       temp_product.name = products[i].name;
                       temp_product.image = products[i].image;
                       temp_product.width = products[i].width;
                       temp_product.height = products[i].height;
                       // add the dropped product in the list of canvas products
                       canvas_products.push(temp_product);
                       // update the product id
                       product_id++;
                       break;
                   }
               }
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
function create_product(posX, posY, texture, product_id)
{
    // create a sprite for the product on the canvas
    let product = new Sprite(texture, product_id);
    // enable the product to be interactive. this will allow it to respond to mouse and touch events
    product.interactive = true;
    // this button mode will mean the hand cursor appears when you roll over the product with your mouse
    product.buttonMode = true;
    // center the product's anchor point
    product.anchor.set(0.5);
    // make the product look normal
    product.scale.set(1);
    // setup events for dragging and dropping the product
    product
        // events for drag start
        .on('mousedown', start_dragging)
        .on('touchstart', start_dragging)
        // events for drag end
        .on('mouseup', stop_dragging)
        .on('mouseupoutside',stop_dragging)
        .on('touchend', stop_dragging)
        .on('touchendoutside', stop_dragging)
        // events for dragging
        .on('mousemove', drag)
        .on('touchmove', drag);

    // position of the product on the canvas
    product.position.x = posX;
    product.position.y = posY;
    // add it to the stage
    app.stage.addChild(product);
}

// a function which handles the start of the dragging of the product
function start_dragging(event)
{
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
                // update the coordinates for the display
                canvas_products[i].x = Math.round(newPositionX - half_width);
                canvas_products[i].y = Math.round(newPositionY - half_height);
            }
        }
        
    }
}
