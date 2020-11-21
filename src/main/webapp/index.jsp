<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
    <head>
        <!-- Bootstrap v4.5.3 -->
        <!-- CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<link rel="stylesheet" href='styles/stylesheet.css'>
		<link rel="icon" href="favicon.ico">

    </head>
    <body>
        <div class="row no-gutters" id="header">
            <div class="col-4" id="headerCol">
                <img class="logo" src="assets/bathroom-planner-logo.png" width="210" height="35">             
            </div>

            <div class="col-8" id="toolbarCol">
                <div class="" id="toolbar">

                    <div class="toolbar-btn-group btn-group">
						<span class="span-toolbar-layouts">
							<li class="layouts-nav-item nav-item dropdown" id="layout-dropdown">
								<a class="layouts-btn nav-link" data-toggle="dropdown"   aria-haspopup="true" aria-expanded="false" id="layout-dropdown-btn">
									<img src="assets/toolbar-icons/layouts.png" width="25" height="25">
								</a>
								<div class="dropdown-menu">
								
									<div>
										<a class="layout-btn text-black font-weight-bold d-flex justify-content-center" data-toggle="modal" data-target="#modal_1">
											<img class="layout-selection-img" src="assets/layouts/layout_1_rectangular.png" width="50" height="50">
										</a>
									</div>
									<div class="dropdown-divider"></div>
									
									<div>
										<a class="layout-btn text-black font-weight-bold d-flex justify-content-center" data-toggle="modal" data-target="#modal_2">
											<img class="layout-selection-img" src="assets/layouts/layout_2_rectangular_corner.png" width="50" height="50">
										</a>
									</div>

								</div>
							</li>
						</span>

						<!--  Room Layout 1 Modal -->
						<div class="modal fade text-primary" id="modal_1" tabindex="-1" aria-labelledby="modalLabel1" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered">
								<div class="modal-content">
									<div class="modal-header">
										<h5 class="modal-title" id="modalLabel1">Are you sure?</h5>
										<button type="button" class="close" data-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">&times;</span>
										</button>
									</div>
									<div class="modal-body">
										Applying a new layout will reset all of your progress.
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
										<button type="button" class="roomLayout btn btn-primary" id="roomLayout_1" data-dismiss="modal">Save changes</button>
									</div>
								</div>
							</div>
						</div>

						<!--  Room Layout 2 Modal -->
						<div class="modal fade text-primary" id="modal_2" tabindex="-1" aria-labelledby="modalLabel2" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered">
								<div class="modal-content">
									<div class="modal-header">
										<h5 class="modal-title" id="modalLabel2">Are you sure?</h5>
										<button type="button" class="close" data-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">&times;</span>
										</button>
									</div>
									<div class="modal-body">
										Applying a new layout will reset all of your progress.
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
										<button type="button" class="roomLayout btn btn-primary" id="roomLayout_2" data-dismiss="modal">Save changes</button>
									</div>
								</div>
							</div>
						</div>
						<div class="toolbar-vertical-divider"></div>
						<!-- <span class="span-toolbar-btns rotate-left"><a class="toolbar-btn" id="btn-rotate-left">&#8634;</a></span> -->
						<!-- <span class="span-toolbar-btns rotate-right"><a class="toolbar-btn" id="btn-rotate-right">&#8635;</a></span> -->
						<span class="span-toolbar-layouts save-plan">
							<a class="toolbar-btn nav-link" id="btn-save-plan"><img src="assets/toolbar-icons/save-icon.png" width="25" height="25"></a>
							<span class="spinner-sp-disabled spinner-border spinner-border-sm text-primary" role="status" id="spinner-save-plan">
								<span class="sr-only">Saving...</span>
							</span>
						</span>
						<span class="span-toolbar-layouts reset-plan"><a class="toolbar-btn nav-link" id="btn-reset-plan"><img src="assets/toolbar-icons/reset-plan.png" width="25" height="25"></a></span>
						<div class="toolbar-vertical-divider"></div>
						<span class="span-toolbar-layouts delete-product"><a class="toolbar-btn nav-link" id="btn-delete-product"><img src="assets/toolbar-icons/delete-product.png" width="25" height="25"></a></span>
					</div>

                </div>
            </div>
		</div>
		
		<hr class="header-line">
		
        <!-- CATALOGUE -->
        <div class="row no-gutters" id="sidebar">
            <div class="col-4" id="sidebar-left">
                <div class='row no-gutters dimensions just-padding'>

					<div class="col-2 product-info-formatting">
						<div class="product-name font-weight-bold">
							<div class="dimensions-row-formatting">Name:</div>
							<div class="product-dimensions font-weight-bold dimensions-row-formatting">Dimensions:</div>
						</div>
					</div>
					<div class="col-10 product-info-formatting">
						<div class="product-name-field dimensions-row-formatting font-weight-bold" id="selection">No selection</div>
						<div class="dimensions-row-formatting">
							<div class="product-dimensions dimensions-field font-weight-bold" id="length" style="display: inline-block;">0</div>
							<div class="product-dimensions font-weight-bold" style="display: inline-block;">x</div>
							<div class="product-dimensions dimensions-field font-weight-bold" id="width" style="display: inline-block;">0</div>
						</div>
					</div>			
           		</div>
                <div class="just-padding" id="catalogue">
					<div class="loading-catalogue loading-catalogue-visible" id="spinner">
						<div class="spinner-border text-light" role="status">
							<span class="sr-only">Loading catalogue...</span>
						</div>
					</div>
                </div>
            </div>
            <div class="col-8" id="main"></div>
        </div>

        <!-- PixiJS -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>
		<script src="scripts/pixijs.util.FreeTransformTool.js"></script>

        <!-- jQuery and JS bundle w/ Popper.js -->
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

        <!-- Custom scripts -->
        <script src="scripts/init.js"></script>
        <script src="scripts/walls.js"></script>
		<script src="scripts/canvas.js"></script>
		<script src="scripts/dimensions.js"></script>
		<script src="scripts/collisions.js"></script>
		<script src="scripts/drag_drop.js"></script>
		<script src="scripts/drag_product.js"></script>
		<script src="scripts/save.js"></script>
		<script src="scripts/reset_plan.js"></script>
		<script src="scripts/load_plan.js"></script>
        <script src="scripts/populate_catalogue.js"></script>
		<script src="scripts/free_rotation.js"></script>
		<script src="scripts/rotate_product.js"></script>
        <script src="scripts/delete_product.js"></script>
        <script src="scripts/ui-behaviour.js"></script>

    </body>
</html>
