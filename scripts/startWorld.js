function startWorld() {
    camOffset = createVector();

    referenceObject = new Ship(createVector(0, 0),createVector(0,0)); //добавить слои, а то корабль рисуется перед астероидами
    // new Asteroid(createVector(400, 400),createVector(0,0));
    // new Asteroid(createVector(200,200), 10, createVector(-1,0));

    for(var i = 0; i < 16; i++){
        new Asteroid(createVector(random(width), random(height)), random(3, 15) * 6, p5.Vector.random2D().mult(10));
    }
  
  new Attractor(createVector(windowWidth / 2, windowHeight / 2), 4500); //m=12000
  

  // new Asteroid(createVector(windowWidth * 0.25, windowHeight * 0.5), 30, createVector(0, -1));
  // new Asteroid(createVector(windowWidth * 0.75, windowHeight * 0.5), 30, createVector(-1, 0));
  new Asteroid(createVector(windowWidth * 0.8, windowHeight * 0.15), 3420, createVector(0.1, 0.1)); //d,m=300

  generateBackgroundUniverse();
}