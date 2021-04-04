
var isPaused = false;
var staticPointGamma = 1;
var selectedBody;

var upperSpeedPrecision = 0.99999; //9
var upperSpeed; //0.9964
var upperSpeedMinus = upperSpeed - 10**(-numAllDigits(upperSpeed));

var PlanetarySystems = [];

function startWorld(){
    createCanvas(windowWidth, windowHeight);
    background(51);

	// create an engine
	engine = Engine.create();
	world = engine.world;
	world.gravity = {x:0,y:0};
    selectedBody = new Empty();
    setC(c);
	referenceBody = new ThirdShip(280, -150);

	//loadMap:
    
	new StellarBody(300, 100, 240);
	new StellarBody(1000, -20, 60);
	new StellarBody(1300, 400, 200);
	new StellarBody(320, 900, 68);
	new StellarBody(555, 1270, 159);
    new StellarBody(-1400, -500, 300);
    new Planet(-200 - 2800, -900, 390, 0.5); //0.00188, 0.003184, 0.000188
    var Earth = Planet.Earth(-1400, 300);
    new Planet(1200, -1200, 390, 2);
    var planet3 = new Planet(8200, -1900, 2000, 1, "darkgreen"); //r=1400

    new Planet(-2760, -7800, 700, 4, "#ffed6b"); //горячая, убийственная плазма
    // var star = new Planet(300, 300, 700, 4, "#ffed6b");
    var planet1 = new Planet(-125, -6315, 200, 1.2, "#62e0f9"); //лёд
    var planet2 = new Planet(300, -6668, 70, 0.6, "#67d758"); //трава или газы, засорённая атмосфера
    

    // PlanetarySystems.push(new PlanetarySystem(star, [planet1, planet2, Earth]));
	// bodies.push(new Ground(width/2, height - 10, width, 20));

	generateBackgroundUniverse();

    prevCamOffset = {x: referenceBody.body.position.x - width/2, y: referenceBody.body.position.y - height/2};
    camOffset = {x: referenceBody.body.position.x - width/2, y: referenceBody.body.position.y - height/2};
}

function updateWorld(){

    staticPointGamma = Math.min(1/(Math.sqrt(Math.max(1-(myMagnitude(referenceBody.body.velocity)/c)**2), 0)), maxGamma);


	if(keyboard.O){
        new StellarBody((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, random(10, 40)* 6);
	}

    if(isPaused == false){

        Matter.Engine.update(engine);

        stellarBodies.forEach( function(stellarBody) {
            bodies.forEach( function(body) {
                if(stellarBody != body && body.type != "StellarBody")
                stellarBody.attract(body.body);
            });
        });

    	bodies.forEach(function(body){
            body.update();
        });

        PlanetarySystems.forEach( function(system, index) {
            system.update();
        });


        // bodies.forEach( function(body1) {
        //     bodies.forEach( function(body2) {
        //         if(body1 != body2)
        //        body1.attract(body2.body);
        //     });
        // });

    } else {}

}

function drawWorld(){
    background(51);
    if(!isPaused){
        prevCamOffset = camOffset;
    }
    camOffset = {x: referenceBody.body.position.x - width/2, y: referenceBody.body.position.y - height/2};


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
        text("c: " + c, width, 59);
        text("Version " + document.gameVersion, width, 75);

        textAlign(LEFT, BOTTOM);
        text("turn off/on debug mode - F3", 2, height);
        text("make screenshot - F1", 2, height - 20);
        pop();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setC(newC){
    var oldC = c;
    c = newC;
    c2 = c**2;
    rmath.c = c;
    rmath.c2 = c2;
    upperSpeed = c * upperSpeedPrecision;
    upperSpeedMinus = upperSpeed - 10  **(-numAllDigits(upperSpeed));
    console.log(upperSpeed);
    console.log(upperSpeedMinus);
    for(var k = 0; k < bodies.length; k++){
        body = bodies[k];
        console.log(myMagnitude(body.body.velocity)*newC/oldC)
        Matter.Body.setVelocity(body.body, myMult(body.body.velocity, newC/oldC));
    }
}