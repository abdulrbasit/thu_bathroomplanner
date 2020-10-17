<?php
    /**
	Author: Domagoj Frecko
	Co-Author: Abdul Basit
    Owner: Domagoj Frecko
    Description: A simple php file that receives the GET request, initializes the Catalogue and sends back a response.
    */
    include 'populateCatalogue.php';

    populateCatalogue();

    // Make async or a promise, or a simple while loop to wait for response from populateCatalogue()
    echo "Catalogue initialized";

?>
