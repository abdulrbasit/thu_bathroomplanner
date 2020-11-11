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

    Cookies.set("Plan", cookieString, {expires : 1000});
}

function getCookies(){
    return Cookies.get("Plan");
}

(function ($) {
    $("#btn-save-plan").on('click', function(event){
  
        let products = [];
        if(sprites.length > 0){
            for (let i = 0; i < sprites.length; i++) {
                products.push(sprites[i].product_db_id);
                console.log(sprites[i].product_db_id);
            }
        }
        let str = JSON.stringify(products);
        console.log(str);
        $.ajax({
            url: 'retrieveCatalogue',
            type: 'post',
            data: {"CookieString":getCookies(), "area":area_text.text.slice(6, -2), "layout":layout, "products" : str}
            
        });
    });
})(jQuery);
