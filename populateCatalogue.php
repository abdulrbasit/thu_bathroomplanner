<?php
/**
	This script implements postgreSQL access to the database
 */

 	// array for storing names of manufacturers
	$dbdata_manufacturer = array();
	// array for storing names of product types
	$dbdata_product_type = array();
	// an array storing details of all products
	$dbdata_product = array();

	// Initialize variable for database credentials
	$conn_string = "host=rosie.db.elephantsql.com port=5432 dbname=mspgxcxr user=mspgxcxr password=yiUV914v2ToEMPbL1gi_sJ6V02YO6Hi1";

	//Create database connection
	$dblink = pg_connect($conn_string);

	//Check connection was successful
	if (!$dblink) {
		die("Failed to connect to database");
	}

	//Fetch all rows from manufacturer, product types and product tables
	$result_manufacturer = pg_query($dblink, "SELECT * FROM manufacturer");
	$result_product_type = pg_query($dblink, "SELECT * FROM product_type");
	$result_product = pg_query($dblink, "SELECT * FROM product");
		
	//Fetch into associative array and store names for manufacturers
	while ( $row = pg_fetch_assoc($result_manufacturer))  {
		$dbdata_manufacturer[] = $row;
	}

	//Fetch into associative array and store names for product types
	while ( $row = pg_fetch_assoc($result_product_type))  {
		$dbdata_product_type[]=$row;
	}
				
	// Fetch into associative array and store data for products
	while($row = pg_fetch_assoc($result_product)){
		$dbdata_product[] = $row;
	}

	// close the database connection in the end
	pg_close($dblink);

	

?>