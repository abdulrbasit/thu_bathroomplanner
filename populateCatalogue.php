<?php
/**
	Author: Abdul Basit 
	Co-Author: Nelson Waffo
	Owner: Abdul Basit
	This script implements postgreSQL access to the database
 */
	function populateCatalogue(){
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
		$result_product_type = pg_query($dblink, "SELECT * FROM product_type");
		$result_product = pg_query($dblink, "SELECT * FROM product");


		// an array containing the names of manufacturers
		$dbdata_manufacturer = array();
		// an array containing the names of product types
		$dbdata_product_type = array();
		// an array of arrays containing details of all products
		$dbdata_product = array();
		
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

		// Populate the catalogue
		for($manufacturer = 0; $manufacturer < sizeof($dbdata_manufacturer); $manufacturer += 1){

			echo '<a href=\"#item-'.($manufacturer + 1).'" class="list-group-item text-warning bg-secondary font-weight-bold" data-toggle="collapse">';
			echo $dbdata_manufacturer[$manufacturer];
			echo '</a>';

			echo '<div class="list-group collapse" id="item-'.($manufacturer + 1).'">';
			
			// Populate product types
			for ($productType = 0; $productType < sizeof($dbdata_product_type); $productType += 1){
				
				echo '<a href="#item-'.($productType + 1).'-'.($productType + 1).'" class="list-group-item font-weight-bold" data-toggle="collapse">';
				echo $dbdata_product_type[$productType];
				echo '</a>';

				echo '<div class="list-group collapse" id="item-'.($productType + 1).'-'.($productType + 1).'">';
				// Populate products
				echo '</div>';
			}

			echo '</div>';
		}

		// close the database connection in the end
		pg_close($dblink);

	}


	function populateProductTypes($dbdata_product_type){

	

	}
?>