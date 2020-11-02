<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <!-- Bootstrap v4.5.3 -->
    <!-- CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href='styles/stylesheet.css'>

</head>
<body>

<div class="row no-gutters">
    <div class="col-3" id="headerCol">
        <div class="text-white font-weight-bold" id="header">
            <div class="title-box">
                <div class="title">Bathroom Planner</div>
            </div>
        </div>
    </div>

    <div class="col-9">
        <div class="" id="toolbar">

            <div class="btn-group">
						<span class="btn-room-layouts">
							<li class="nav-item dropdown">
								<button type="button" class="nav-link btn btn-secondary" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Layouts</button>
								<div class="dropdown-menu">

									<div>
										<a class="text-black font-weight-bold d-flex justify-content-center" data-toggle="modal" data-target="#modal_1">
											-----------------<br>
											|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
											|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
											|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
											|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
											-----------------<br>
										</a>
									</div>
									<div class="dropdown-divider"></div>

									<div>
										<a class="text-black font-weight-bold d-flex justify-content-center" data-toggle="modal" data-target="#modal_2">
											-----------------<br>
											|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
											|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br>
											|&emsp;&emsp;&emsp;&emsp;&ensp;____|<br>
											|&emsp;&emsp;&emsp;&emsp;|<br>
											-----------<br>
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

                <span class="rotate-left"><button type="button" class="btn btn-secondary" id="btn-rotate-left">&#8634;</button></span>
                <span class="rotate-right"><button type="button" class="btn btn-secondary" id="btn-rotate-right">&#8635;</button></span>
                <span class="delete-product"><button type="button" class="btn btn-secondary" id="btn-delete-product">&#x1F5D1;</button></span>
            </div>

        </div>
    </div>
</div>
<!-- CATALOGUE -->
<div class="row no-gutters" id="sidebar">
    <div class="col-3" id="sidebar-left">
        <div class='dimensions'>
            <table>
                <tr>
                    <td><label class='object_names' > Name </label></td>
                    <td>
                        <select id="objects" onchange="update_properties()"><option value="Bathroom Layout">Bathroom Layout</option></select>
                    </td>
                </tr>
                <tr>
                    <td><label class='object_names'> Position </label></td>
                    <td>
                        <textarea readonly rows="1" cols="1"> x </textarea>
                        <textarea readonly id="posx" rows="1" cols="6">  </textarea>
                        <textarea readonly rows="1" cols="1"> y </textarea>
                        <textarea readonly id="posy" rows="1" cols="6">  </textarea>
                    </td>
                </tr>
                <tr>
                    <td><label class='object_names'> Dimensions </label></td>
                    <td>
                        <textarea readonly rows="1" cols="4">Length</textarea>
                        <textarea readonly id="length" rows="1" cols="6">  </textarea>
                        <textarea readonly rows="1" cols="4">Width</textarea>
                        <textarea readonly id="width" rows="1" cols="6">  </textarea>
                    </td>
                </tr>
                </tr>
            </table>
        </div>
        <div class="just-padding" id="catalogue">
        </div>
    </div>
    <div class="col-9" id="main"></div>
</div>
<!--<div id="sidebar-right">Right</div>-->

<!-- <div class="navbar fixed-bottom" id="footer">Footer</div> -->


<!-- PixiJS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>

<!-- jQuery and JS bundle w/ Popper.js -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<!-- Custom scripts -->
<script src="scripts/init.js"></script>
<script src="scripts/walls.js"></script>
<script src="scripts/canvas.js"></script>
<script src="scripts/drag_product.js"></script>
<script src="scripts/populate_catalogue.js"></script>
<script src="scripts/dimensions.js"></script>
<script src="scripts/rotate_product.js"></script>
<script src="scripts/delete_product.js"></script>

</body>
</html>
