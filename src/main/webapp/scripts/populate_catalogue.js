// Globals
const MANUFACTURERS = 0;
const PRODUCT_TYPES = 1;
const PRODUCTS = 2;
const ID = 0;
const NAME = 1;
const PRODUCT_TYPE_MANUFACTURER_ID = 2;
const PRODUCTS_PRODUCT_TYPE_ID = 5;
const IMAGE_PATH = 2;
const PRODUCT_LENGTH = 3;
const PRODUCT_WIDTH = 4;

// AJAX call
let catalogue;
(function ($) {
    $(document).ready(function () {
        $.ajax({
            url: 'retrieveCatalogue',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                catalogue = JSON.parse(JSON.stringify(response));
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
    for(manufacturer = 0; manufacturer < catalogue[MANUFACTURERS].length; manufacturer += 1){
        var manufacturer_id = catalogue[MANUFACTURERS][manufacturer][ID];

        output += "<a href=\"#item-"+ manufacturer_id +"\" class=\"list-group-item manufacturer text-white font-weight-bold\" data-toggle=\"collapse\">"+ catalogue[MANUFACTURERS][manufacturer][NAME] +"</a>";

        output += "<div class=\"list-group collapse\" id=\"item-"+ manufacturer_id +"\">";

        for(productType = 0; productType < catalogue[PRODUCT_TYPES].length; productType += 1){
            var productType_id = catalogue[PRODUCT_TYPES][productType][ID];

            if(catalogue[PRODUCT_TYPES][productType][PRODUCT_TYPE_MANUFACTURER_ID] == manufacturer_id){

                output += "<a href=\"#item-"+ manufacturer_id +"-"+ productType_id +"\" class=\"list-group-item productType text-white font-weight-bold\" data-toggle=\"collapse\"><span class=\"productTypeSpan\">"+ catalogue[PRODUCT_TYPES][productType][NAME] +"</span></a>";

                output += "<div class=\"list-group list-group-flush collapse\" id=\"item-"+ manufacturer_id +"-"+ productType_id +"\">";

                for(product = 0; product < catalogue[PRODUCTS].length; product += 1){
                    var product_id = catalogue[PRODUCTS][product][ID];

                    if(catalogue[PRODUCTS][product][PRODUCTS_PRODUCT_TYPE_ID] == productType_id){

                        output += "<a href=\"#\" class=\"list-group-item product text-primary\">";
                        output += "<img src=\""+ catalogue[PRODUCTS][product][IMAGE_PATH] +"\" class=\"products\" id=\""+ product_id +"\" alt=\"Product image\" width=\""+(90 * ( catalogue[PRODUCTS][product][PRODUCT_LENGTH] / catalogue[PRODUCTS][product][PRODUCT_WIDTH] ))+"\" height=\"90\" ondragstart=\"set_id(this.id)\">";
                        output += "<span class=\"productSpan\">"+ catalogue[PRODUCTS][product][PRODUCT_LENGTH] +"cm x "+ catalogue[PRODUCTS][product][PRODUCT_WIDTH] +"cm</span></a>";

                    }
                }
                output += "</div>";

            }
        }
        output += "</div>";
    }
    output += "</div>";
    htmlCatalogue.innerHTML = output;

}