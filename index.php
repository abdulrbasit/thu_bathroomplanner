<!DOCTYPE html>
<html>
	<head>
    	<!-- Bootstrap v4.5.3 -->
		<!-- CSS -->
		<link rel="stylesheet" href='stylesheet.css'>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <link rel="stylesheet" href="/resources/demos/style.css">  
		<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	</head>
	<body>
		<div id="header"><h1>Bathroom Planner</h1></div>
			
		<!-- CATALOGUE -->
		<div class="row">
		<div class="col-sm-3" id="sidebar-left">
			<div class="tabDiv">
				<ul class="nav nav-tabs">
					<li class="nav-item">
						<a href="#catalogue" class="nav-link active" data-toggle="tab">Catalogue</a>
					</li>
					<li class="nav-item">
						<a href="#floorLayouts" class="nav-link" data-toggle="tab">Floor Layouts</a>
					</li>
				</ul>
			
				<div class="tab-content">
					<div class="tab-pane  fade show active" id="catalogue">
						<div class="just-padding">
                                                  <!--  list-group-root well -- had to remove it for the drag and drop -->
							<div class="list-group">

							<?php include 'populateCatalogue.php';
								// create a json representation of the products
								$json_products = json_encode($dbdata_product);
								echo "<div id='json_products' style='display: none;'>" . $json_products . "</div>";

								// Populate the catalogue
								foreach($dbdata_manufacturer as $key_m => $manufacturer){
									$manufacturer_id = $manufacturer['id'];

									echo '<a href="#item-'.($key_m + 1).'" class="list-group-item text-warning bg-secondary font-weight-bold" data-toggle="collapse">';
									echo $manufacturer['name']; 
									echo '</a>';

									echo '<div class="list-group collapse" id="item-'.($key_m + 1).'">';
											
									// Populate product types
									foreach ($dbdata_product_type as $key_pt => $productType){
										$productType_id = $productType['id'];
										
										if($productType['manufacturer_id'] == $manufacturer_id){
											echo '<a href="#item-'.($manufacturer_id).'-'.($productType_id).'" class="list-group-item font-weight-bold" data-toggle="collapse">';
											echo $productType['name'];
											echo '</a>';
								
											echo '<div class="list-group collapse" id="item-'.($manufacturer_id).'-'.($productType_id).'">';
											
											// Populate products
											// Formula for img dimensions (aspect ratio): [ newWidth = (newHeight * aspectRatio) ], [ aspectRatio = (oldWidth / oldHeight) ]
											// The product dimensions from the database are used (length = image width, width = image height) as they provide the aspect ratio (top-down 2D image)
											foreach ($dbdata_product as $key_prod => $product){
												if($product['product_type_id'] == $productType_id){
													echo '<a href="#" class="list-group-item">';
													echo '<img src="'.$product['image'].'" class="products" id="'.$product['name'].'" alt="Product image" width="'.(90 * ($product['length'] / $product['width'])).'" height="90" ondragstart="set_id(this.id)">';
													echo $product['name'];
													echo '</a>';
												}
											}
											echo '</div>';
										}
									}

									echo '</div>';
								}
							?>
							</div>
						</div>
					</div>

					<div class="tab-pane fade show" id="floorLayouts">
						<div class="just-padding">
							<div class="list-group list-group-root">
								<div class="">
									<a class="list-group-item text-warning bg-secondary font-weight-bold d-flex justify-content-center">
										-----------------<br>
										|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
										|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
										|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
										|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
										-----------------<br>
									</a>
								</div>
								<div class="">
									<a class="list-group-item text-warning bg-secondary font-weight-bold d-flex justify-content-center">
										-----------------<br>
										|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
										|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
										|&emsp;&emsp;&emsp;&emsp;&ensp;____|<br>
										|&emsp;&emsp;&emsp;&emsp;|<br>
										-----------<br>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col" id="main"></div>

		<!--<div id="sidebar-right">Right</div>-->
		</div>
		<div class="navbar fixed-bottom" id="footer">Footer</div>
	</body>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>

	<script src="scripts/init.js"></script>
	<script src="scripts/walls.js"></script>	
	<script src="scripts/canvas.js"></script>
	<script src='scripts/drag_product.js'></script>

	<!-- jQuery and JS bundle w/ Popper.js -->
	<!--had to comment it out too <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>-->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
	<!-- had to comment it out <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>-->
	
	<!-- Ajax request -->
	<!-- <script type="text/javascript">
		// Send a GET request to the server to update the catalogue
		// url: php file where the request is sent
		// type: type of request
		// datatype: type of data that is looked for in the response
		(function ($) {
			$(document).ready(function () {
				$.ajax({
					url: 'initCatalogue.php',
					type: 'get',
					dataType: 'text',
					success: function (response) {
						console.log(response);
					}
				});
			});
		})(jQuery);
	</script> -->
</html>