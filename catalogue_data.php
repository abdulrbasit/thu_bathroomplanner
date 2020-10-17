<?php
/**
	Author: Abdul Basit 
	Co-Author: Nelson Waffo
	This script implements postgreSQL access to the manufacturer table and  stores the data in JSON format
 */
// Initialize variable for database credentials
    $conn_string = "host=rosie.db.elephantsql.com port=5432 dbname=mspgxcxr user=mspgxcxr password=yiUV914v2ToEMPbL1gi_sJ6V02YO6Hi1";

//Create database connection
  	$dblink = pg_connect($conn_string);

//Check connection was successful
  	if (!$dblink) {
     	die("Failed to connect to database");
  	}

//Fetch all rows from manufacturer, product types and product tables
	$result_manufacturer = pg_query($dblink, "SELECT name FROM manufacturer");
	$result_product_type = pg_query($dblink, "SELECT name FROM product_type");
	$result_product = pg_query($dblink, "SELECT name, image, width, height FROM product");

//Initialize array variable
    // an array containing the names of manufacturers
	$dbdata_manufacturer = array();
	// an array containing the names of product types
	$dbdata_product_type = array();
	// an array of arrays containing details of all products
	$dbdata_product = array();

	//Fetch into associative array and store names for manufacturers
	$index = 0;
  	while ( $row = pg_fetch_assoc($result_manufacturer))  {
		 $dbdata_manufacturer[$index] = $row['name'];
		 $index++;
	}

	//Fetch into associative array and store names for product types
	$index = 0;
	while ( $row = pg_fetch_assoc($result_product_type))  {
		$dbdata_product_type[$index]=$row['name'];
		$index++;
	 }
	 		  
	// process the obtained result: product consists of a name, image, height and width
	$index = 0;
	$inner_index = 0;
	while($row = pg_fetch_assoc($result_product)){
		// simple array
		$temp = array();
		// add the elements in an array
		$temp[$inner_index] = $row['name'];
		$inner_index++;
		$temp[$inner_index] = $row['image'];
		$inner_index++;
		$temp[$inner_index] = $row['width'];
		$inner_index++;
		$temp[$inner_index] = $row['height'];
		$inner_index = 0;
		// add the array to the product array
		$dbdata_product[$index] = $temp;
		$index++;
	}

	/**
	 * data to be passed
	 * array of manufacturers: dbdata_manufacturer
	 * array of product types: dbdata_product_type
	 * an array of arrays of products: dbdata_product
	 * */

	// create a json representation of the associative array dbdata_manufacturer
	$json_dbdata_manufacturer = json_encode($dbdata_manufacturer);
	// create a json representation of the associative array dbdata_product_type
	$json_dbdata_product_type = json_encode($dbdata_product_type);
	// create a json representation of the associative array dbdata_product
	$json_dbdata_product      = json_encode($dbdata_product);

	// close the database connection in the end
	pg_close($dblink);
?>
