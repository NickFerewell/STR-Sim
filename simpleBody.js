class SimpleBody{
	constructor(){
		bodies.push(this);
		this.options = {
			// velocity: {x: vx , y: vy},
			slop: 0,
			restitution: 0,
			frictionAir: 0,
			parentObject: this
		}
		this.gamma = {x: 1, y: 1};
		this.Gamma = 1;
		// this.gammaX = 1;
		// this.gammaY = 1;
	}

	draw(){
		push();

		// translate(-this.body.position.x, -this.body.position.y);

		// if(lengthContractionMode){
  //           // translate(this.body.position.x - camOffset.x - (referenceBody.body.position.x - this.body.position.x) * (zoom-1) - (referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gammaX), this.body.position.y - camOffset.y - (referenceBody.body.position.x - this.body.position.x) * (zoom-1) - (referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gammaY));
  //       } else {
  //           // translate(this.pos.x - camOffset.x - (referenceObject.pos.x - this.pos.x) * (zoom-1) + (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x), this.pos.y - camOffset.y - (referenceObject.pos.y - this.pos.y) * (zoom-1) + (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y));
  //       }
        // translate( (this.body.position.x - referenceBody.body.position.x) * (zoom-1),  (this.body.position.y - referenceBody.body.position.y) * (zoom-1))
        
        	//camera Offset:
		// translate(width/2, height/2);
		// translate(-referenceBody.body.position.x, -referenceBody.body.position.y);
		translate(-camOffset.x, -camOffset.y);

		translate(this.body.position.x, this.body.position.y);


			//Distance contraction:
		// translate((referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gamma.x) * zoom, (referenceBody.body.position.y - this.body.position.y) * (1 - 1/this.gamma.y) * zoom);
        
        // var distanceDelta = myMult(mySub(this.body.position, referenceBody.body.position), (1 - 1/this.Gamma) * zoom);
        // drawArrow(createVector(), distanceDelta);
        // console.log(distanceDelta)
        // translate(distanceDelta.x, distanceDelta.y);

        var newB1 = myNormalize(referenceBody.body.velocity);
        var newB2 = {x: -newB1.y, y: newB1.x};

        var bMatrix = [
        [newB1.x, newB1.y],
        [newB2.x, newB2.y]];

        var revBMatrix = myFastReverseMatrix(bMatrix);

        var newRefBodyPos = myMatrixMultByVec(bMatrix, [referenceBody.body.position.x, referenceBody.body.position.y]);
        var newPos = myMatrixMultByVec(bMatrix, [this.body.position.x, this.body.position.y]);

        var deltaD = {x: (newPos[0] - newRefBodyPos[0])*(1-1/this.Gamma), y: 0}; //расстояние по оси параллельной скорости точки отсчёта

        var oldDeltaD = myMatrixMultByVec(revBMatrix, [deltaD.x, deltaD.y]);

        translate(-oldDeltaD[0], -oldDeltaD[1]);

        // console.log(deltaD)



        	//Length contrastion:
        rotate(myHeading(referenceBody.body.velocity));
        scale(1/this.Gamma, 1);
        rotate(-myHeading(referenceBody.body.velocity));

        // scale(1/this.gamma.x, 1/this.gamma.y);

        // scale(Math.abs(myNormalize(this.body.velocity).x) / this.gamma.x, Math.abs(myNormalize(this.body.velocity).y) / this.gamma.y);
        // console.log(this.gamma, this.Gamma, myMagnitude(this.gamma));

         	//приближение или отдаление
        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))
  		scale(zoom, zoom);


		// translate(width, height);

		// rotate(- referenceBody.body.angle%(2*PI));
		// rotate(-referenceBody.interpolatedAngle);

		// translate(-this.body.position.x, -this.body.position.y);


		// translate(this.body.position.x - referenceBody.body.position.x + width/2, this.body.position.y - referenceBody.body.position.y + height/2);
			

		/*//Стандартные настройки:
			translate(width/2, height/2);
			translate(-this.body.position.x, -this.body.position.y);
			translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);
		*/
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
				// this.body.vertices.forEach( function(vert) {
				// 	vertex(vert.x, vert.y);
				// });
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


		pop();

		// drawArrow({x: width/2, y: height/2}, myMult(mySub(referenceBody.body.position, this.body.position), (1 - 1/this.Gamma) * zoom));
	}

	regularDraw(){
		push();

		// translate(-this.body.position.x, -this.body.position.y);

		// if(lengthContractionMode){
  //           // translate(this.body.position.x - camOffset.x - (referenceBody.body.position.x - this.body.position.x) * (zoom-1) - (referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gammaX), this.body.position.y - camOffset.y - (referenceBody.body.position.x - this.body.position.x) * (zoom-1) - (referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gammaY));
  //       } else {
  //           // translate(this.pos.x - camOffset.x - (referenceObject.pos.x - this.pos.x) * (zoom-1) + (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x), this.pos.y - camOffset.y - (referenceObject.pos.y - this.pos.y) * (zoom-1) + (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y));
  //       }
        // translate( (this.body.position.x - referenceBody.body.position.x) * (zoom-1),  (this.body.position.y - referenceBody.body.position.y) * (zoom-1))
         
		// translate(width/2, height/2);
		// translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);

			//camera offset:
		// translate(width/2, height/2);
		// translate(-referenceBody.body.position.x, -referenceBody.body.position.y);
		translate(-camOffset.x, -camOffset.y);

		translate(this.body.position.x, this.body.position.y);

         //приближение или отдаление
        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))
        // scale(1/this.gamma.x, 1/this.gamma.y);
        // scale(Math.abs(myNormalize(this.body.velocity).x) / this.gamma.x, Math.abs(myNormalize(this.body.velocity).y) / this.gamma.y);
        // console.log(this.gamma, this.Gamma, myMagnitude(this.gamma));

  		scale(zoom, zoom);


		// translate(width, height);

		// rotate(- referenceBody.body.angle%(2*PI));
		// rotate(-referenceBody.interpolatedAngle);

		// translate(-this.body.position.x, -this.body.position.y);


		// translate(this.body.position.x - referenceBody.body.position.x + width/2, this.body.position.y - referenceBody.body.position.y + height/2);
			

		/*//Стандартные настройки:
			translate(width/2, height/2);
			translate(-this.body.position.x, -this.body.position.y);
			translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);
		*/
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
				// this.body.vertices.forEach( function(vert) {
				// 	vertex(vert.x, vert.y);
				// });
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
		pop();
	}

	oldContractionDraw(){
		push();

		// translate(-this.body.position.x, -this.body.position.y);

		// if(lengthContractionMode){
  //           // translate(this.body.position.x - camOffset.x - (referenceBody.body.position.x - this.body.position.x) * (zoom-1) - (referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gammaX), this.body.position.y - camOffset.y - (referenceBody.body.position.x - this.body.position.x) * (zoom-1) - (referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gammaY));
  //       } else {
  //           // translate(this.pos.x - camOffset.x - (referenceObject.pos.x - this.pos.x) * (zoom-1) + (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x), this.pos.y - camOffset.y - (referenceObject.pos.y - this.pos.y) * (zoom-1) + (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y));
  //       }
        // translate( (this.body.position.x - referenceBody.body.position.x) * (zoom-1),  (this.body.position.y - referenceBody.body.position.y) * (zoom-1))
        
        	//camera Offset:
		// translate(width/2, height/2);
		// translate(-referenceBody.body.position.x, -referenceBody.body.position.y);
		translate(-camOffset.x, -camOffset.y);

		translate(this.body.position.x, this.body.position.y);


			//Distance contraction:
		translate((referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gamma.x) * zoom, (referenceBody.body.position.y - this.body.position.y) * (1 - 1/this.gamma.y) * zoom);
        
        // var distanceDelta = myMult(mySub(this.body.position, referenceBody.body.position), (1 - 1/this.Gamma) * zoom);
        // drawArrow(createVector(), distanceDelta);
        // console.log(distanceDelta)
        // translate(distanceDelta.x, distanceDelta.y);


         	//приближение или отдаление
        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))
        
        	//Length contrastion:
        // rotate(myHeading(referenceBody.body.velocity));
        // scale(1/this.Gamma, 1);
        // rotate(-myHeading(referenceBody.body.velocity));

        scale(1/this.gamma.x, 1/this.gamma.y);

        // scale(Math.abs(myNormalize(this.body.velocity).x) / this.gamma.x, Math.abs(myNormalize(this.body.velocity).y) / this.gamma.y);
        // console.log(this.gamma, this.Gamma, myMagnitude(this.gamma));

  		scale(zoom, zoom);


		// translate(width, height);

		// rotate(- referenceBody.body.angle%(2*PI));
		// rotate(-referenceBody.interpolatedAngle);

		// translate(-this.body.position.x, -this.body.position.y);


		// translate(this.body.position.x - referenceBody.body.position.x + width/2, this.body.position.y - referenceBody.body.position.y + height/2);
			

		/*//Стандартные настройки:
			translate(width/2, height/2);
			translate(-this.body.position.x, -this.body.position.y);
			translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);
		*/
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
				// this.body.vertices.forEach( function(vert) {
				// 	vertex(vert.x, vert.y);
				// });
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
		pop();
	}

	afterDraw(){
		if(DEBUG_MODE){
			push();
				//camera offset:
			// translate(width/2, height/2);
			// translate(-referenceBody.body.position.x, -referenceBody.body.position.y);
			translate(-camOffset.x, -camOffset.y);

			translate(this.body.position.x, this.body.position.y);
			translate((referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gamma.x) * zoom, (referenceBody.body.position.y - this.body.position.y) * (1 - 1/this.gamma.y) * zoom);
	        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))
	        scale(1/this.gamma.x, 1/this.gamma.y);
	  		scale(zoom, zoom);

			textAlign(CENTER)
			stroke(255)
			fill(0)
			if(renderMode == 1){
				text(myMagnitude(this.gamma).toFixed(2), 0, 0)
			} else {
				text(this.Gamma.toFixed(2), 0, 0);
			}
			pop();
		}
	}

	update(){ //считать скорость самому, чтобы не было резких изменений скорости при взаимодействиях объектов. dX/dT - изменение не обязательно за один кадр. Лагает только ускоренный двигатель
		// if(myMagnitude(this.body.velocity) >= c){
		// 	myMult(this.body.velocity, 0.01);
		// }

		if(Math.abs(this.body.velocity.x) >= c){
			Matter.Body.setVelocity(this.body, {x: Math.sign(this.body.velocity.x) * (c - 0.01), y: this.body.velocity.y});
		}
		if(Math.abs(this.body.velocity.y) >= c){
			Matter.Body.setVelocity(this.body, {x: this.body.velocity.x, y: Math.sign(this.body.velocity.y) * (c - 0.01)});
		}

		var relVel = relativeVelocity(this.body.velocity, referenceBody.body.velocity);  //Сделать изменение гаммы плавным lerp()
        this.gamma.x = 1/(Math.sqrt(1 - (relVel.x / c)**2));
        this.gamma.y = 1/(Math.sqrt(1 - (relVel.y / c)**2)); // /Math.SQRT2

        this.Gamma = 1/Math.sqrt(1 - (myMagnitude(relVel)/c)**2);

        // console.log(myMagnitude(this.gamma))

        // this.gamma = myDiv(myNormalize(relVel),myMagnitude(mySqrtOfVec(mySub(myNormalize(relVel), mySqrOfVec(myDiv(relVel, c))))));

        // this.gamma.x = this.Gamma * myNormalize(relVel).x;
        // this.gamma.y = this.Gamma * myNormalize(relVel).y;
        // console.log(myMagnitude(this.body.velocity))
	}

	attract(body){
		// if(!this.body.isStatic){
			// console.log(body)
		var bodyPos;
		var bodyMass = 0;
		var thisPos = this.body.position;
		var thisMass = this.body.mass;
		var bodyToPull;
		if(body.type == "composite"){
			bodyPos = body.bodies[0].position;
			body.bodies.forEach( function(body, index) {
				bodyMass += body.mass;
			});
			bodyToPull = body.bodies[0];
		} else {
			bodyPos = body.position;
			bodyMass = body.mass;
			bodyToPull = body;
		}
		var force = (G * (thisMass * bodyMass)) / (myDist(bodyPos, thisPos))**2;
		var dir = myNormalize(mySub(bodyPos, thisPos));
		// console.log(mult1(dir, force));
		// Matter.Body.applyForce(bodyToPull, bodyPos, myMult(dir, force));
		bodyToPull.parentObject.applyForce(myMult(dir, force));
		// }
		// if(this.body.isStatic){
		// 	console.log(this.body.mass);
		// }
	}

	applyForce(force){ //скорение инвертировано относительно скорости. Узнать почему и исправить
		// force = myMult(myNormalize({x: mouseX - width/2, y: mouseY - height/2}), 100);
		// console.log(this)
		// console.log(force)
		/*
		var newBasisI = myNormalize(this.body.velocity);
		// console.log(myNormalize(this.body.velocity))
		var newBasisJ = {x: -newBasisI.y, y: newBasisI.x}; //-y, +x,   y,x
		var BasisMatrix = 
		[[newBasisI.x, newBasisJ.x],
		 [newBasisI.y, newBasisJ.y]];

		// var FinI = force.x * newBasisI.x + force.y * newBasisJ.x;
		// var FinJ = force.x * newBasisI.y + force.y * newBasisJ.y;
		var FinNewBasis = myMatrixMultByVec(BasisMatrix, [force.x, force.y]);

		// console.log(FinNewBasis)

		// var accInI = FinI / (this.gamma**3 * this.body.mass);
		// var accInJ = FinJ / (this.gamma * this.body.mass);

		var accInNewBasis = {x: FinNewBasis[0] / (myMagnitude(this.gamma)**3 * this.body.mass), y: FinNewBasis[1] / (myMagnitude(this.gamma) * this.body.mass)};

		// var revDet = 1/myMatrixDet(BasisMatrix); //reversedDeterminant
		// var BasisX = {x: newBasisJ.y * revDet, y: newBasisI.y * revDet};
		// var BasisY = {x: newBasisJ.x * revDet, y: newBasisI.y * revDet};
		// var antiBasisMatrix = myMatrixMultByNum(myMatrixTranspon(BasisMatrix), revDet);
		var antiBasisMatrix = myReverseMatrix(BasisMatrix);

		var accInXY = myMatrixMultByVec(antiBasisMatrix, [accInNewBasis.x, accInNewBasis.y]);

		// drawArrow(createVector(width/2, height/2), createVector(myMult(newBasisI, 40).x, myMult(newBasisI, 40).y))
		// drawArrow(createVector(width/2, height/2), createVector(myMult(newBasisJ, 40).x, myMult(newBasisJ, 40).y), "blue")

		// drawArrow(createVector(width/2, height/2), createVector(BasisMatrix[0][0] * 40, BasisMatrix[1][0] * 40))
		// drawArrow(createVector(width/2, height/2), createVector(BasisMatrix[0][1] * 40, BasisMatrix[1][1] * 40), "blue")

		// console.log(accInNewBasis)
		// console.log(accInXY)
		// console.log(createVector(accInXY[0], accInXY[1]).normalize().mult(40))
		// drawArrow(createVector(1000, 100), createVector(accInXY[0], accInXY[1]).normalize().mult(50), "red")
		// push()
		// stroke(10)
		// strokeWeight(10)
		// // line(100, 100, accInXY[0] * 10000, accInXY[1] * 10000)
		// pop()
		// drawArrow(createVector(width/2, height/2), createVector(accInI, accInJ));
		// drawArrow(createVector(), createVector(accInI.x, accInI.y).mult(40), "red");
		// drawArrow(createVector(), createVector(accInJ.x, accInJ.y), "red");

		// var acc = {x: accX, y: accY};
		Matter.Body.applyForce(this.body, this.body.position, {x: accInXY[0] * this.body.mass, y: accInXY[1] * this.body.mass});
		*/


		// var acc = ((force.x - (this.body.velocity.x**2 * force.x) / c**2)) / (this.mass * this.gamma.x); //(f - (v**2 * f)/(c**2)) / (m * gamma)
		// var acc = (mySub(force, ))

		// var relVel = relativeVelocity(this.body.velocity, referenceBody.body.velocity);
		// var accX = ((force.x - (this.body.velocity.x**2 * force.x) / c**2)) / (this.body.mass * this.gamma.x);
  //       var accY = ((force.y - (this.body.velocity.y**2 * force.y) / c**2)) / (this.body.mass * this.gamma.y);
  //       var acc = createVector(accX, accY);

		var acc = myDiv(mySub(force, myMult(this.body.velocity, myScalarMult(this.body.velocity, force)/(c**2))), this.body.mass * this.Gamma);
		// var acc = myDiv(force, this.body.mass * this.Gamma**3)
		// var acc = myDiv(force, this.body.mass * staticGamma**3)
		Matter.Body.applyForce(this.body, this.body.position, myMult(acc, -this.body.mass));
	}
}