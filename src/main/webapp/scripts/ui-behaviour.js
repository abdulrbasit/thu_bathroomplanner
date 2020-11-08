// A script which enables custom UI behaviour

$("a.layouts-btn").click(function(){
				
    if( $("a").attr("aria-expanded") === "true"){console.log("HELLO");}
    if( $("a.layouts-btn").hasClass("layouts-btn-toggled")){
        $("a.layouts-btn").removeClass("layouts-btn-toggled");
    }
    else {$("a.layouts-btn").addClass("layouts-btn-toggled");}        		
   });


$("a.layout-btn").click(function(){
    if( $("a.layouts-btn").hasClass("layouts-btn-toggled")){
        $("a.layouts-btn").removeClass("layouts-btn-toggled");
    }
    else; //do nothing        		
   });

   
$(document).click(function(event) {
    var $target = $(event.target);
    if(!$target.closest('.layout-btn').length && $('a.layouts-btn').hasClass("layouts-btn-toggled")){
        $("a.layouts-btn").removeClass("layouts-btn-toggled");
    }
});