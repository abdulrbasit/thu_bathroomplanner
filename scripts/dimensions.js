let selection = document.getElementById("objects").value;
let posx = document.getElementById('posx');
let posy = document.getElementById('posy');
let width = document.getElementById('width');
let height = document.getElementById('height');
	
// this is a work in progress. the function is not dynamic yet, but will be.
function update_properties() {
    if(selection == 'Bathroom Layout'){
      posx.innerHTML = walls[0].wallSprite.x; 
      posy.innerHTML = walls[0].wallSprite.y; 
      width.innerHTML = walls[0].wallSprite.width; 
      height.innerHTML = walls[2].wallSprite.width; 
    }else if(selection == 'Toilet'){
          posx.innerHTML = 30;
          posy.innerHTML = 40;
          width.innerHTML = 25;
          height.innerHTML = 35;
    }else if(selection == 'Bathtub'){
          posx.innerHTML = 50;
          posy.innerHTML = 60;
          width.innerHTML = 45;
          height.innerHTML = 55;
    }else if(selection == 'Sink'){
          posx.innerHTML = 70;
          posy.innerHTML = 80;
          width.innerHTML = 65;
          height.innerHTML = 75;
    }
  }