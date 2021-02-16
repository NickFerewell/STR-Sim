function updateWorld() {
    camOffsetX = referenceObject.pos.x - width/2;
    camOffsetY = referenceObject.pos.y - height/2;
    camOffset = createVector(camOffsetX, camOffsetY);


    for(i = 0; i < bodies.length; i++) {
      for(j = 0; j < bodies.length; j++){
        if(bodies[j] != bodies[i]){
          bodies[j].attract(bodies[i]);
        }
      }
    }

    bodies.forEach(body => {
        body.update();
    });

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}