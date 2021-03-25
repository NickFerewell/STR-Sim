class NewShip extends SimpleBody{
	constructor(x, y){
		super();
		this.turningSpeed = 0.0025; //0.0006, 0.04
		this.options.mass = 10;

		this.isBoosting = false;
		this.isWarping = false;
		this.turningSide = 0;
		this.rotation = newGeometries.ship.rotation;


		this.parts = newGeometries.ship.shapes;
		
		for(var i = 0; i < this.parts.length; i++){
			// part = Object.assign(newGeometries.standartGeometry.shapes[0], part);
			this.parts[i] = _.merge(_.cloneDeep(newGeometries.standartGeometry.shapes[0]), this.parts[i]);
			// part.shapes.forEach( function(shape, index) {
			// 	myExtend(shape, newGeometries.standartGeometry.shapes[0])
			// });
			// console.log(part)
		};
		// console.log(newGeometries.standartGeometry.shapes[0])
		// console.log(this.parts)
		// console.log(newGeometries.standartGeometry.shapes[0])

		// console.log(Object.assign(newGeometries.standartGeometry.shapes[0], newGeometries.ship.shapes[0]));
		

		var verts = [];

		newGeometries.ship.shapes.forEach( function(shape, index) {
			// console.log(shape)
			if(shape.isPhysical == true){			
				shape.vertexes.forEach( function(vert, index) {
				verts.push({x: vert.x * newGeometries.ship.scale.x * shape.scale.x, y: vert.y * newGeometries.ship.scale.y * shape.scale.y})
			});
			}
		});

		// console.log(newGeometries.ship.shapes);
		// console.log(this.parts);
		var newVerts = [];

		for(var i = 0; i < verts.length; i++){
			var vert = verts[i];
			var rotatedX = vert.x * Math.cos(this.rotation) - vert.y * Math.sin(this.rotation);
	        var rotatedY = vert.x * Math.sin(this.rotation) + vert.y * Math.cos(this.rotation);
	        newVerts.push({x: rotatedX, y: rotatedY});	
		}

		this.body = Bodies.fromVertices(x, y, newVerts, this.options);
		World.add(world, this.body);

		this.interpolatedAngleOld = this.body.angle;
		this.interpolatedAngle = this.body.angle; //почему-то не работает, проверить тестами со стрелками поворота
	}

	update(){
		super.update();
		this.interpolatedAngle = lerp(this.interpolatedAngleOld, this.body.angle, 0.09);
		this.interpolatedAngleOld = this.interpolatedAngle;
		if(keyboard.W || keyboard.upArrPressed){
			// Matter.Body.applyForce(this.body, this.body.position, p5.Vector.fromAngle(this.body.angle - PI/2).mult(0.004)); //this.body.Force.x += force;
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(0.004));
			this.isBoosting = true;
		} else{
			this.isBoosting = false;
		}
		if(keyboard.shiftPressed && this.isBoosting){
			this.applyForce(p5.Vector.fromAngle(this.body.angle - PI/2).mult(0.04)); //0.02
			this.isWarping = true;
		} else this.isWarping = false;
		// const {force, velocity} = ship.matterBody;
		// force.x += Math.cos(angle) * shipThrust;
		// force.y += Math.sin(angle) * shipThrust;
		if(keyboard.A || keyboard.leftArrPressed){
			this.body.torque += -this.turningSpeed;
			this.turningSide = -1;
		} else if(keyboard.D || keyboard.rightArrPressed){
			this.body.torque += this.turningSpeed;
			this.turningSide = 1;
		} else {this.turningSide = 0;}

		if(myMagnitude(this.body.velocity) >= c){
			myMult(this.body.velocity, 0.3);
		}
		// var staticPointGamma = 1/(Math.sqrt(1-(myMagnitude(this.body.velocity)/c)**2));
		// this.body.velocity = myMult(this.body.velocity, staticPointGamma)
		// console.log(myMagnitude(this.body.velocity));
		// console.log(myMagnitude(relativeVelocity(this.body.velocity, {x:0, y:0})))
	}
	draw(){
		super.draw();
		this.drawAnimationParts();

		
		// this.applyForce();
	}
	regularDraw(){
		super.regularDraw();

		this.drawAnimationParts();
	}

	afterDraw(){
		if(DEBUG_MODE){
			push() //згыр(=
			scale(zoom);
			var acc = myDiv(this.body.force, this.body.mass)
			drawArrowWithName(createVector(width/2, height/2), myMult(acc, 500000), "g: " + (myMagnitude(acc) / Planet.gOnEarth).toFixed(2)) //Рисовать стрелку со значением g
			// console.log((myMagnitude(acc) / Planet.gOnEarth).toFixed(2))
			pop();

			text(myMagnitude(this.body.velocity), 0, 10);
		}
	}

	//Кориандр - кенза - петрушка(чихотное действие)

	drawAnimationParts(){ //Анимируются все части в принципе, но те у которых нет анимации просто рисуют себя
		for(var i = 0; i < this.parts.length; i++){
			var figure = this.parts[i];
			if(figure.isRendering){
				var figureToRender;

				// console.log(figure.renderCondition + " " + this[figure.renderCondition] + " " + figure.renderConditionValue)
				if (figure.renderCondition == null || ((figure.renderCondition in this) && (this[figure.renderCondition] == figure.renderConditionValue)) ||(!("renderConditionValue" in figure) && (this[figure.renderCondition] == true)) || (figure.renderConditionValue == null && this[renderCondition] == true)){
				// if(this[figure.renderCondition] == figure.renderConditionValue){
					// console.log(figure.renderCondition, figure.renderConditionValue)
					if(figure.currentStep.timeLeft <= 0){
						figure.currentStep.stepNum = (figure.currentStep.stepNum + 1) % (figure.animation.length);
						figure.currentStep.timeLeft = figure.animation[figure.currentStep.stepNum].time;
					}
					figure.currentStep.timeLeft--;
					figureToRender = _.merge(_.cloneDeep(figure), figure.animation[figure.currentStep.stepNum].options);
				} else {
					if(figure.isAnimContinuous == false){
						// console.log(figure)
						figure.currentStep.stepNum = 0; figure.currentStep.timeLeft = figure.animation[0].time; 
					}
					continue;
				}

				push();
				//Переделать названия настроек, чтобы совпадали с p5-овскими или настройками в разделе render тела из Matter.js
				if(figureToRender.fill){
					fill(figureToRender.color);
				} else {
					noFill();
				}
				stroke(figureToRender.outline);
				strokeWeight(figureToRender.stroke);

				translate(width/2, height/2);
				// rotate(- referenceBody.body.angle%(2*PI));
				// rotate(-referenceBody.interpolatedAngle);
				translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);
				rotate(figureToRender.angle + this.body.angle);
				translate(figureToRender.position.x, figureToRender.position.y);
				scale(figureToRender.scale.x, figureToRender.scale.y);

				switch (figureToRender.type) {
					case "circle":
					ellipseMode(RADIUS);
						circle(0, 0, figureToRender.r);
						break;

					case "concave line":
						beginShape();
						figureToRender.vertexes.forEach( function(vert) {
							// vertex(vert.x * figure.scale.x + figure.position.x, vert.y * figure.scale.y + figure.position.y);
							vertex(vert.x, vert.y);
						});
						endShape(CLOSE);
						break;

					// case "rect":
					// 	rectMode(CENTER);
					// 	rect(0, 0, this.w, this.h);
					// 	break;

					default:
						textAlign(CENTER);
						text("there is no geometry", 0, 0)
						break;
				}
				pop(); //убрать pop() для смешных багов
			}
		}
	}
}