//example code, код на показ

//Главный файл, координирующий все остальные. Он запускается в первую очередь
//#region 
/*
var world;

function setup(){
    startWorld();
}

function draw(){
    updateWorld();
    drawWorld();
}
*/
//#endregion

/*
function startWorld(){
    createCanvas(windowWidth, windowHeight);
}

function updateWorld(){
    background(51);
    circle(40, 40, this.body.circleRadius);
}
*/

/* Пример того, что можно нарисовать с помощью нескольких строк кода
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(51);
    
    stroke(90);
    strokeWeight(4);
    fill(170, 140, 200);
    scale(4);
    
    circle(40, 40, 50);
    
    push();
    translate(70, 30);
    rotate(50);
    scale(5);
    beginShape();
    vertex(0, -1.5);
    vertex(-1, 0);
    vertex(1, 0)
    endShape(CLOSE);
    pop();
    
    push();
    translate(80, 70);
    rotate(3);
    fill(200, 180, 0);
    rect(0, 0, 50, 20);
    pop();
}
*/

/* Примери реализации получения ввода с клавиатуры и того же с мышкой
var keyboard = { 
    downArrPressed: false,
    spacePressed: false,
    shiftPressed: false,
    W: false,
    anyKeyPressed: false,
};
var oldKeyboard;

function keyPressed() {
    oldKeyboard = keyboard;
    switch (keyCode) {
        case DOWN_ARROW:
            keyboard.downArrPressed = true;
            break;
        case 32:
            keyboard.spacePressed = true;
            break;
        case 87:
            keyboard.W = true;
            break;
        default:
            break;
    }
}

function keyReleased() {
    oldKeyboard = keyboard;
    switch (keyCode) {
        case DOWN_ARROW:
            keyboard.downArrPressed = false;
            break;
        case 32:
            keyboard.spacePressed = false;
            break;
        case 87:
            keyboard.W = false;
            break;
        default:
            break;
    }
}

function getKeyClicked(key){
    if(oldKeyboard[key] == false && keyboard[key] == true){
        return true;
    } else return false;
}
*/

/* Пример испоьзования системы ввода. Она не работает и ужасно спроектирована.
if(keyboard.spacePressed){
    ship.thrust();
}

if(getKeyClicked("W")){
    player.jump;
}
*/

/*
function startWorld(){
	engine = Engine.create();
	world = engine.world;
	world.gravity = {x:0,y:0};
    setC(c);

    new Planet(300, 100, 240, 1);
}

generateBackgroundUniverse();
*/

class SimpleBody{
	constructor(){
		bodies.push(this);
		this.options = {
			slop: 0,
			restitution: 0,
			frictionAir: 0,
			parentObject: this
		}
		this.Gamma = 1;
	}

	draw(){
		push();
		translate(-camOffset.x, -camOffset.y);
		translate(this.body.position.x, this.body.position.y);

			//Distance contraction:
        var newB1 = myNormalize(referenceBody.body.velocity);
        var newB2 = {x: -newB1.y, y: newB1.x};

        var bMatrix = [
        [newB1.x, newB1.y],
        [newB2.x, newB2.y]];

        var revBMatrix = myFastReverseMatrix(bMatrix);

        var newRefBodyPos = myMatrixMultByVec(bMatrix, [referenceBody.body.position.x, referenceBody.body.position.y]);
        var newPos = myMatrixMultByVec(bMatrix, [this.body.position.x, this.body.position.y]);

        var deltaD = {x: (newPos[0] - newRefBodyPos[0])*(1-1*this.invGamma), y: 0};

        var oldDeltaD = myMatrixMultByVec(revBMatrix, [deltaD.x, deltaD.y]);

        translate(-oldDeltaD[0] * zoom, -oldDeltaD[1] * zoom);

         	//приближение или отдаление
        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))
  		scale(zoom, zoom);

  		    //Length contraсtion:
        rotate(myHeading(this.relVel));
        scale(1*this.invGamma, 1);
        rotate(-myHeading(this.relVel));
		
		fill(this.body.render.fillStyle);
		stroke(117);

		switch (this.body.type) {
			case "Circle Body":
			ellipseMode(RADIUS);
				circle(0, 0, this.body.circleRadius);
				break;

			case "body":
				beginShape();
				for(var i = 0; i < this.body.vertices.length; i++){
					vertex(this.body.vertices[i].x - this.body.position.x, this.body.vertices[i].y - this.body.position.y);
				}
				endShape(CLOSE);
				break;

			default:
				textAlign(CENTER);
				text("there is no geometry", 0, 0)
				break;
		}
		pop();
	}


	update(){
		if(myMagnitude(this.body.velocity) > upperSpeed){
			Matter.Body.setVelocity(this.body, myChangeMag(this.body.velocity, upperSpeedMinus*0.9999));
		} else if (this.body.velocity == NaN) {
			Matter.Body.setVelocity(this.body, this.previousVelocity);
		}

		if(myMagnitude(this.relVel) >= c){
			Matter.Body.setVelocity(this.body, this.previousVelocity);
			Matter.Body.setPosition(this.body, this.body.positionPrev);
			this.body.positionPrev = myCopy(this.positionPrev);
		}

		var dir = mySub(this.body.velocity, referenceBody.body.velocity);
        var magnitude = clamp(rmath.sDiff(this.body.velocity, referenceBody.body.velocity), 0, upperSpeed)
		this.relVel = myChangeMag(dir, magnitude);

        this.Gamma = rmath.lorentz(magnitude);

		Matter.Body.translate(this.body, myMult(this.body.velocity, (this.staticPointGamma - 1)));
	}

	attract(body){
		var force = (G * (this.body.mass * body.body.mass)) / (myDist(body.body.position, this.body.position))**2;
		var dir = myNormalize(mySub(this.body.position, body.body.position));
		body.parentObject.applyForce(myMult(dir, force));
	}

	applyForce(force){
		var acc = myDiv(mySub(force, myMult(this.relVel, myScalarMult(this.relVel, force)/(rmath.c2))), this.Gamma);
		Matter.Body.applyForce(this.body, this.body.position, acc);
	}
}