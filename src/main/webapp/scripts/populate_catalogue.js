// Globals
const MANUFACTURERS = 0;
const PRODUCT_TYPES = 1;
const PRODUCTS = 2;
const PRODUCT_DIMENSIONS = 3;
const IMG_SIZES = [65, 55, 45];

// AJAX call
// Retrieve a catalogue array which consists of 3 arrays: manufacturers, product types and products.
let catalogue;
(function ($) {
    $(document).ready(function () {
        $.ajax({
            url: 'retrieveCatalogue',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                catalogue = JSON.parse(JSON.stringify(response));

                // Pass the products and their dimensions to drag_product.js
                drag_product_products = catalogue[2].slice();
                drag_product_product_dimensions = catalogue[3].slice();

                writeToCatalogue(catalogue);
            }
        });
    });
})(jQuery);


// Function which writes the manufacturers, product types and products to the catalogue
// All the HTML code is appended to a single string and then that string is put into the HTML element
function writeToCatalogue(catalogue){

    htmlCatalogue = document.getElementById("catalogue");
    var output = "<div class=\"list-group\">"; // Everything will be contained within this variable

    var manufacturer;
    var productType;
    var product;
    var product_dimension;
    var product_dimensions_of_product;
    var product_dimensions_iterator;
    

    for(manufacturer = 0; manufacturer < catalogue[MANUFACTURERS].length; manufacturer += 1){
        var manufacturer_id = catalogue[MANUFACTURERS][manufacturer]['id'];

        output += "<a href=\"#item-"+ manufacturer_id +"\" class=\"list-group-item manufacturer text-white font-weight-bold\" data-toggle=\"collapse\">"+ catalogue[MANUFACTURERS][manufacturer]['name'] +"</a>";

        output += "<div class=\"list-group collapse\" id=\"item-"+ manufacturer_id +"\">";

        for(productType = 0; productType < catalogue[PRODUCT_TYPES].length; productType += 1){
            var productType_id = catalogue[PRODUCT_TYPES][productType]['id'];

            if(catalogue[PRODUCT_TYPES][productType]['manufacturer_id'] == manufacturer_id){

                output += "<a href=\"#item-"+ manufacturer_id +"-"+ productType_id +"\" class=\"list-group-item productType text-white font-weight-bold\" data-toggle=\"collapse\"><span class=\"productTypeSpan\">"+ catalogue[PRODUCT_TYPES][productType]['name'] +"</span></a>";

                output += "<div class=\"list-group list-group-flush collapse\" id=\"item-"+ manufacturer_id +"-"+ productType_id +"\">";

                for(product = 0; product < catalogue[PRODUCTS].length; product += 1){
                    var product_id = catalogue[PRODUCTS][product]['id'];
                    product_dimensions_of_product =[[],[],[]];
                    product_dimensions_iterator = 0;

                    if(catalogue[PRODUCTS][product]['product_type_id'] == productType_id){

                        for(product_dimension = 0; product_dimension < catalogue[PRODUCT_DIMENSIONS].length; product_dimension += 1){

                            if(catalogue[PRODUCT_DIMENSIONS][product_dimension]['product_id'] == product_id){
                            
                                // Store the dimensions of the product in a temporary array
                                product_dimensions_of_product[product_dimensions_iterator][0] = product_id;
                                product_dimensions_of_product[product_dimensions_iterator][1] = catalogue[PRODUCT_DIMENSIONS][product_dimension]['length'];
                                product_dimensions_of_product[product_dimensions_iterator][2] = catalogue[PRODUCT_DIMENSIONS][product_dimension]['width'];

                                product_dimensions_iterator += 1;
                            }
                        }

                        if (!Array.isArray(product_dimensions_of_product[2]) || !product_dimensions_of_product[2].length) {
                            // array does not exist, is not an array, or is empty
                            product_dimensions_of_product.splice(2,1);
                        }
                        if (!Array.isArray(product_dimensions_of_product[1]) || !product_dimensions_of_product[1].length) {
                            // array does not exist, is not an array, or is empty
                            product_dimensions_of_product.splice(1,1);
                        }

                        product_dimensions_of_product.sort(sortArrayLength);
                        product_dimensions_of_product.sort(sortArrayWidth);

                        output += "<div href=\"#\" class=\"list-group-item product text-primary\">";

                        for(product_dimension = 0; product_dimension < product_dimensions_of_product.length; product_dimension += 1){

                            output += "<span style=\"display:inline-block;\">";
                            output += "<span style=\"display:block;\"><img src=\""+ catalogue[PRODUCTS][product]['image'] +"\" class=\"products\" id=\""+ product_id +"\" alt=\"Product image\" width=\""+(IMG_SIZES[product_dimension] * ( product_dimensions_of_product[product_dimension][1] / product_dimensions_of_product[product_dimension][2] ))+"\" height=\""+IMG_SIZES[product_dimension]+"\" ondragstart=\"set_id(this.id)\"></span>";
                            output += "<span style=\"display:block;\" class=\"productSpan\">"+ product_dimensions_of_product[product_dimension][1] +"cm x "+ product_dimensions_of_product[product_dimension][2] +"cm</span>";
                            output += "</span>";
                        }

                        output += "</div>";
                    }
                }
                output += "</div>";
            }
        }
        output += "</div>";
    }
    output += "</div>";
    htmlCatalogue.innerHTML = output;
    init_draggable();
}

// Sorts the second value of the multidimensional array - highest to lowest
function sortArrayLength(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? 1 : -1;
    }
}

// Sorts the third value of the multidimensional array - highest to lowest
function sortArrayWidth(a, b) {
    if (a[2] === b[2]) {
        return 0;
    }
    else {
        return (a[2] < b[2]) ? 1 : -1;
    }
}