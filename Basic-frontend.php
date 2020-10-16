<html>
  <head>
     <link rel="stylesheet" href='css_layout.css'>
	</head>
	<body>
	<style>
.collapsible {
  background-color: #123;
  color: white;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}	

.active, .collapsible:hover {
  background-color: #555;
}

.content {
  padding: 0 18px;
  display: none;
  overflow: hidden;
  background-color: #f1f1f1;
}
</style>	
		<div id="header"><b>Bathroom Planner</b></div>
		<div id="sidebar-left"><p id="catalogue-title"><b>Products & Manufacturers</b></p>
        <button type="button" class="collapsible">Manufacturer 1</button>		
        <button type="button" class="collapsible">Manufacturer 2</button>
		<button type="button" class="collapsible">Manufacturer 3</button>

		</div>
		<div id="main"></div>
		<div id="sidebar-right">Right</div>
		<div id="footer"></div>

	</body>
</html>