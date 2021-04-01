class ThirdShip extends AnimationBody{
	constructor(x,y){
		super(x, y, newGeometries.ship);

		Matter.Body.setMass(this.body, 10)
		this.turningSpeed = 0.0025 * this.body.mass; //0.0006, 0.04, 0.025
		this.speed = 0.0004 * this.body.mass;
		this.warpSpeed = this.speed * 4;  //0.02, this.speed * 10,4,5
		this.stoppingSpeed = 0.001; //0.005 / 5

		this.isBoosting = false;
		this.isWarping = false; //круизная скорость
		this.isManeuvering = false; //Очень мальенькая скорость для лёгких изменений траектории полёта
		this.turningSide = 0;
		this.ManeuveringSpeed = 0.003;

		this.interpolatedAngleOld = this.body.angle;
		this.interpolatedAngle = this.body.angle;

		// this.interpolatedVelocity = this.body.velocity;
		// this.interpolatedVelocityOld = this.body.velocity;
	}

	update(){
		super.update();

		this.interpolatedAngle = lerp(this.interpolatedAngleOld, this.body.angle, 0.09);
		this.interpolatedAngleOld = this.interpolatedAngle;

		// this.interpolatedVelocityOld = this.interpolatedVelocity;
		// this.interpolatedVelocity = vectorLerp2(this.interpolatedVelocityOld, this.body.velocity, 0.09);

		if(keyboard.W || keyboard.upArrPressed){
			this.isBoosting = true;
		} else{
			this.isBoosting = false;
		}

		if(keyboard.controlPressed && this.isBoosting){
			this.isManeuvering = true;
		} else{
			this.isManeuvering = false;
		}
		if(this.isManeuvering){
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(this.ManeuveringSpeed *0));
			console.log(this.ManeuveringSpeed / 100000)
		}
		if(this.isBoosting){
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(this.speed));
		}

		if(keyboard.shiftPressed && this.isBoosting && !this.isManeuvering){
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(this.warpSpeed));
			this.isWarping = true;
		} else this.isWarping = false;

		if(keyboard.A || keyboard.leftArrPressed){
			this.turningSide = -1;
			this.body.torque += -this.turningSpeed * !keyboard.controlPressed + this.ManeuveringSpeed * keyboard.controlPressed * this.turningSide;
		} else if(keyboard.D || keyboard.rightArrPressed){
			this.turningSide = 1;
			this.body.torque += this.turningSpeed * !keyboard.controlPressed + this.ManeuveringSpeed * keyboard.controlPressed * this.turningSide;
		} else {this.turningSide = 0;}

		if(keyboard.spacePressed){
			if(myMagnitude(this.body.velocity) > upperSpeed){ //0.9964
				this.body.velocity = myChangeMag(this.body.velocity, upperSpeedMinus*0.9999); //0.9999, 0.99639
			}
			this.applyForce(myMult({x: -this.body.velocity.x, y: -this.body.velocity.y}, this.stoppingSpeed * Math.sqrt(staticPointGamma)));
		}

		    //Length contraction alternative:
		// Matter.Body.setPosition(this.body, myAdd(this.body.position, myMult(this.body.velocity, (staticPointGamma - 1))));
	}

	afterDraw(){
		super.afterDraw();
		if(DEBUG_MODE){
			var acc = myDiv(this.body.force, this.body.mass);
			drawArrowWithName(createVector(width/2, height/2), myMult(acc, 500000), "g: " + (myMagnitude(acc) / Planet.gOnEarth).toFixed(2), "red", zoom) //Рисовать стрелку со значением g

			var vel = relativeVelocity(this.body.velocity, selectedBody.body.velocity);
			drawArrowWithName(createVector(width/2, height/2), myMult(vel, screenMaxFPS), "v: " + myMagnitude(vel).toFixed(2), "#39729d", zoom);

			push();
			scale(1.5);
			text("VrelativeToO: " + myMagnitude(this.body.velocity), 0, 10); //Сделать класс менеджера интерфейса
			text("V/c: " + myMagnitude(this.body.velocity) / c, 0, 20);
			text("StaticPntGamma: " + staticPointGamma, 0, 30);
			text("Analog V: " + myMagnitude(this.previousVelocity), 0, 40);

			text("x: " + this.body.position.x, 0, 50)
			text("y: " + this.body.position.y, 0, 60)
			pop();
		}
	}

	applyForce(force){ //Для самой системы отсчёта другие правила
		var acc = myDiv(mySub(force, myMult(this.body.velocity, myScalarMult(this.body.velocity, force)/(c**2))), this.body.mass * this.Gamma);
		Matter.Body.applyForce(this.body, this.body.position, myMult(acc, this.body.mass));
	}
}