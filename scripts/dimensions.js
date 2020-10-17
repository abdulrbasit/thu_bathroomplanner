// this is a work in progress. the function is not dynamic yet, but will be.
function update_properties() {
    let selection = document.getElementById("objects").value;
    let posx = document.getElementById('posx');
    let posy = document.getElementById('posy');
    let width = document.getElementById('width');
    let height = document.getElementById('height');
    if(selection == 'Bathroom Layout'){
      posx.innerHTML = wall1_x; 
          posy.innerHTML = wall1_y; 
          width.innerHTML = wall_side; 
          height.innerHTML = wall_side; 
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