class ThirdShip extends AnimationBody{
	constructor(x,y){
		super(x, y, newGeometries.ship);

		Matter.Body.setMass(this.body, 10)
		this.turningSpeed = 0.025; //0.0006, 0.04

		this.isBoosting = false;
		this.isWarping = false; //круизная скорость
		this.isManeuvering = false; //чень мальенькая скорость для лёгких изменений траектории полёта
		this.turningSide = 0;
		this.ManeuveringSpeed = 0.003;

		this.interpolatedAngleOld = this.body.angle;
		this.interpolatedAngle = this.body.angle; //почему-то не работает, проверить тестами со стрелками поворота
	}

	update(){
		super.update();

		this.interpolatedAngle = lerp(this.interpolatedAngleOld, this.body.angle, 0.09);
		this.interpolatedAngleOld = this.interpolatedAngle;

		if(keyboard.W || keyboard.upArrPressed){
			this.isBoosting = true;
			// if(keyboard.shiftPressed){
			// 	this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(0.04)); //0.02
			// 	this.isWarping = true;
			// } else this.isWarping = false;

		} else{
			this.isBoosting = false;
		}

		if(keyboard.controlPressed && this.isBoosting){ //Сделать машину состояний!
			this.isManeuvering = true;
		} else{
			this.isManeuvering = false;
		}
		if(this.isManeuvering){
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(this.ManeuveringSpeed *0));
			console.log(this.ManeuveringSpeed / 100000)
		}
		if(this.isBoosting){
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(0.004));
		}

		if(keyboard.shiftPressed && this.isBoosting && !this.isManeuvering){
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(0.04)); //0.02
			this.isWarping = true;
		} else this.isWarping = false;

		if(keyboard.A || keyboard.leftArrPressed){
			this.turningSide = -1;
			this.body.torque += -this.turningSpeed * !keyboard.controlPressed + this.ManeuveringSpeed * keyboard.controlPressed * this.turningSide;
		} else if(keyboard.D || keyboard.rightArrPressed){
			this.turningSide = 1;
			this.body.torque += this.turningSpeed * !keyboard.controlPressed + this.ManeuveringSpeed * keyboard.controlPressed * this.turningSide;
		} else {this.turningSide = 0;}

		if(myMagnitude(this.body.velocity) >= c*0.999991){
			// myMult(this.body.velocity, 0.3);
			// Matter.Body.setVelocity(this.body, myChangeMag(this.body.velocity, c * 0.9999));
			this.body.velocity = myChangeMag(this.body.velocity, c * 0.99999); //0.9999
		}

		if(keyboard.spacePressed){
			// this.body.velocity = myMult(this.body.velocity, 0)
			Matter.Body.setVelocity(this.body, {x: 0, y: 0});
		}

			//Length contraction alternative(реальное физическое сокращение расстояний):
		// var staticPointGamma = 1/(Math.sqrt(Math.max(1-(myMagnitude(this.body.velocity)/c)**2), 0));
		// console.log(staticPointGamma)
		// this.body.velocity = myMult(this.body.velocity, staticPointGamma); //так делать нельзя, нужно умножать скорость и вручную прибавлять к позиции, изменять скорость нельзя
	}

	afterDraw(){
		super.afterDraw();
		if(DEBUG_MODE){
			var acc = myDiv(this.body.force, this.body.mass);
			push();
			scale(zoom);
			drawArrowWithName(createVector(width/2 /zoom, height/2 /zoom), myMult(acc, 500000 * zoom), "g: " + (myMagnitude(acc) / Planet.gOnEarth).toFixed(2)) //Рисовать стрелку со значением g
			pop();
			// console.log((myMagnitude(acc) / Planet.gOnEarth).toFixed(2))
			push();
			scale(1.5);
			text("VrelativeToO: " + myMagnitude(this.body.velocity), 0, 10); //Сделать класс менеджера интерфейса
			text("V/c: " + myMagnitude(this.body.velocity) / c, 0, 20);
			text("StaticPntGamma: " + staticPointGamma, 0, 30);

			text("x: " + this.body.position.x, 0, 50)
			text("y: " + this.body.position.y, 0, 60)
			pop();
		}
	}
}