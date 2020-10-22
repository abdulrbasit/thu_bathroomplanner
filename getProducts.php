<?php
    /**
    Description: A simple php file that receives the GET request, obtains the products in a json object and returns them.
    */
    include 'populateCatalogue.php';

    $json_products = json_encode($dbdata_product);

    // Make async or a promise, or a simple while loop to wait for response from populateCatalogue()
    echo $json_products;

?>
