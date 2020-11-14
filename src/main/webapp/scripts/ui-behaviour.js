// A script which enables custom UI behaviour
$(document).ready(function () {

    // Handler - Layouts dropdown menu button
    $("#layout-dropdown").on('click', '.layouts-btn', function (event) {

        event.stopPropagation();

        if( $("a.layouts-btn").hasClass("layouts-btn-toggled")){
            $("a.layouts-btn").removeClass("layouts-btn-toggled");
            $("li.layouts-nav-item").removeClass("show");
            $("a.layouts-btn").attr("aria-expanded", false);
            $("div.dropdown-menu").removeClass("show");
        }

        else {
            $("a.layouts-btn").addClass("layouts-btn-toggled");
            $("li.layouts-nav-item").addClass("show");
            $("a.layouts-btn").attr("aria-expanded", true);
            $("div.dropdown-menu").addClass("show");
        }  

    });

    // Handler - Buttons inside of layouts dropdown
    $("#layout-dropdown").on('click', '.layout-btn', function (event) {

        if( $("a.layouts-btn").hasClass("layouts-btn-toggled")){
            $("a.layouts-btn").removeClass("layouts-btn-toggled");
            $("li.layouts-nav-item").removeClass("show");
            $("a.layouts-btn").attr("aria-expanded", false);
            $("div.dropdown-menu").removeClass("show");
        }

        else; //do nothing        		
    });

    // Handler - Anywhere on the document
    $(document).click(function(event) {
        var $target = $(event.target);
        if(!$target.closest('.layout-btn').length && $('a.layouts-btn').hasClass("layouts-btn-toggled")){
            $("a.layouts-btn").removeClass("layouts-btn-toggled");
            $("li.layouts-nav-item").removeClass("show");
            $("a.layouts-btn").attr("aria-expanded", false);
            $("div.dropdown-menu").removeClass("show");
        }
    });

});