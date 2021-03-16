
var isPaused = false;
var staticPointGamma = 1;

function startWorld(){
    createCanvas(windowWidth, windowHeight);
    background(51);
	// create an engine
	engine = Engine.create();
	world = engine.world;
	world.gravity = {x:0,y:0};
	referenceBody = new ThirdShip(280, -150);

    // new NewShip(0,0)


	//loadMap:
	new StellarBody(300, 100, 240);
	new StellarBody(1000, -20, 60);
	new StellarBody(1300, 400, 200);
	new StellarBody(320, 900, 68);
	new StellarBody(555, 1270, 159);
    new StellarBody(-1400, -500, 300);
    new Planet(-200 - 2800, -900, 390, 0.5); //0.00188, 0.003184, 0.000188
    Planet.Earth(-1400, 300);
    new Planet(1200, -1200, 390, 2);


    new Planet(-2760, -7800, 700, 4);
    new Planet(-125, -6315, 200, 1.2);
    new Planet(300, -6668, 70, 0.6)

	// bodies.push(new Ground(width/2, height - 10, width, 20));

	// // run the engine
	// Engine.run(engine);

	generateBackgroundUniverse();

    prevCamOffset = {x: referenceBody.body.position.x - width/2, y: referenceBody.body.position.y - height/2};
    camOffset = {x: referenceBody.body.position.x - width/2, y: referenceBody.body.position.y - height/2};
}

function updateWorld(){

    staticPointGamma = 1/(Math.sqrt(Math.max(1-(myMagnitude(referenceBody.body.velocity)/c)**2), 0));

	if(keyboard.O){
		// new StellarBody(mouseX + camOffset.x/zoom, mouseY + camOffset.y/zoom, random(10, 40)* 6);
        new StellarBody((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, random(10, 40)* 6);
	}

    if(isPaused == false){

        Matter.Engine.update(engine)

    	bodies.forEach(function(body){
            body.update();
        });

        stellarBodies.forEach( function(stellarBody) {
            bodies.forEach( function(body) {
                if(stellarBody != body)
                stellarBody.attract(body.body);
            });
        });


        // bodies.forEach( function(body1) {
        //     bodies.forEach( function(body2) {
        //         if(body1 != body2)
        //        body1.attract(body2.body);
        //     });
        // });

    } else {}


    // bodies.forEach( function(body1) {
    //     bodies.forEach( function(body2) {
    //         if(body1 != body2)
    //        body1.attract(body2.body);
    //     });
    // });


}

function drawWorld(){
    background(51);

    camOffset = {x: lerp(prevCamOffset.x, referenceBody.body.position.x - width/2, camSpeed), y: lerp(prevCamOffset.y, referenceBody.body.position.y - height/2, camSpeed)};
    prevCamOffset = camOffset;

    if(keyboard.Plus){
    	changeZoom(1, 0.5);
    }
    if(keyboard.Minus){
    	changeZoom(-1, 0.5);
    }

	drawBackgroundUniverse();

    if(renderMode == 0){
        bodies.forEach( function(body) {
            body.regularDraw();
        });
    } else if(renderMode == 1){
        bodies.forEach( function(body) {
            body.oldContractionDraw();
        });
    } else if(renderMode == 2){
        bodies.forEach( function(body) {
            body.draw();
        });
    }

    bodies.forEach( function(body) {
        body.afterDraw();
    });

    if(DEBUG_MODE){
        push();
        textAlign(RIGHT, TOP);
        textSize(32);
        text(currentFPS, width, 0);
        textSize(20);
        text("drawMode" + renderMode, width, 25);
        text("zoom: " + zoom.toFixed(2), width, 42);

        textAlign(LEFT, BOTTOM);
        text("switch off debug mode - F3", 0, height);
        pop();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}