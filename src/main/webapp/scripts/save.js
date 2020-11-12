/*
* A script which gathers canvas data in a data structure named cookieString and stores it as a cookie.
* the cookieString is a json object whose key is a string and value is an array of json objects
*/
const cookie_name = "Plan";
// a function used to gather user data. the function later creates a cookie with the user data
function setCookies(){
    let walls = getWalls();
    let products = sprites;
    let cookieString = "{ \"walls\" : [";
    for (let wall = 0; wall < walls.length - 1; wall++) {
        cookieString += walls[wall].wallSprite.toString() + ", ";
        
    }
    cookieString += walls[walls.length - 1].wallSprite.toString() + "]";

    if(products.length != 0){
        cookieString += ", \"products\": [";
        if(products.length > 1){
            for (let product = 0; product < products.length - 1; product++) {
                cookieString += products[product].toString() + ", ";
            }
            cookieString +=  products[(products.length - 1)].toString() +  "]";
        }else if(products.length == 1){
            cookieString +=  products[0].toString() +  "]";
        }
    }
    
    cookieString += "}";

    Cookies.set(cookie_name, cookieString, {expires : 1000}, { sameSite: 'lax' }, { secure: true });
}

// a function used to obtain cookies from their storage area
function getCookies(){
    return Cookies.get(cookie_name);
}

// a function used to store data as cookies and in the database
(function ($) {
    $("#btn-save-plan").on('click', function(event){
        // set the cookies: store user data in the file system of this PC
        setCookies();
        let products = [];
        if(sprites.length > 0){
            for (let i = 0; i < sprites.length; i++) {
                products.push(sprites[i].product_db_id);
            }
        }
        let str = JSON.stringify(products);
        $.ajax({
            url: 'retrieveCatalogue',
            type: 'post',
            data: {"CookieString":getCookies(), "area":area_text.text.slice(6, -2), "layout":layout, "products" : str}
            
        });
        alert("Your data has been saved.");
    });
})(jQuery);
