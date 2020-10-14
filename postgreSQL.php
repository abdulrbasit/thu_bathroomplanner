
<?php
/**
	Author: Abdul Basit
	Co-Author: 
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

//Fetch all rows from manufacturer table
	  $result_manufacturer = pg_query($dblink, "SELECT * FROM manufacturer");
	  $result_product_type = pg_query($dblink, "SELECT * FROM product_type");

//Initialize array variable
	  $dbdata_manufacturer = array();
	  $dbdata_product_type = array();

//Fetch into associative array
  	while ( $row = pg_fetch_row($result_manufacturer))  {
	     $dbdata_manufacturer[]=$row;
	  }

//Fetch into associative array
	while ( $row = pg_fetch_row($result_product_type))  {
		$dbdata_product_type[]=$row;
 	}

?>