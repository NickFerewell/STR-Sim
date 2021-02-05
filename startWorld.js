function startWorld() {
    camOffset = createVector();

    referenceObject = new Ship(createVector(0, 0),createVector(0,0)); //добавить слои, а то корабль рисуется перед астероидами
    new Asteroid(createVector(400, 400),createVector(0,0));
    new Asteroid(createVector(200,200), createVector(-1,0));

    for(var i = 0; i < 16; i++){
        new Asteroid(createVector(random(width), random(height)), createVector(2,0.8));
    }
}