class SimpleBody{
	constructor(){
		bodies.push(this);
		this.options = {
			slop: 0,
			restitution: 0,
			frictionAir: 0,
			parentObject: this
		}
		this.gamma = {x: 1, y: 1};
		this.Gamma = 1;
		this.relVel = {x: 0, y: 0};
		this.previousVelocity = {x:0, y: 0};
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

        var deltaD = {x: (newPos[0] - newRefBodyPos[0])*(1-1/this.Gamma), y: 0}; //расстояние по оси параллельной скорости точки отсчёта

        var oldDeltaD = myMatrixMultByVec(revBMatrix, [deltaD.x, deltaD.y]);

        translate(-oldDeltaD[0] * zoom, -oldDeltaD[1] * zoom);
		


         	//приближение или отдаление
        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))
  		scale(zoom, zoom);


  		//Length contraсtion:
        rotate(myHeading(this.relVel));
        scale(1/this.Gamma, 1);
        rotate(-myHeading(this.relVel)); //referenceBody.interpolatedVelocity
		
		circle(0, 0, 5);
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

		// for(var k = 1, length3 = this.body.parts.length; k < length3; k++){
		// 	const part = this.body.parts[k];

		// 	// translate(-part.position.x + part.parent.position.x, -part.position.y + part.parent.position.y)
		// 	beginShape();
		// 	for(var i = 0; i < part.vertices.length; i++){
		// 		vertex(part.vertices[i].x - part.position.x, part.vertices[i].y - part.position.y);
		// 	}
		// 	// this.body.vertices.forEach( function(vert) {
		// 	// 	vertex(vert.x, vert.y);
		// 	// });
		// 	endShape(CLOSE);

		// 	// switch (part.type) {
		// 	// 	case "Circle Body":
		// 	// 	ellipseMode(RADIUS);
		// 	// 		circle(0, 0, part.circleRadius);
		// 	// 		break;	

		// 	// 	case "body":
		// 	// 		beginShape();
		// 	// 		for(var i = 0; i < part.vertices.length; i++){
		// 	// 			vertex(part.vertices[i].x - part.position.x, part.vertices[i].y - part.position.y);
		// 	// 		}
		// 	// 		// this.body.vertices.forEach( function(vert) {
		// 	// 		// 	vertex(vert.x, vert.y);
		// 	// 		// });
		// 	// 		endShape(CLOSE);
		// 	// 		break;

		// 	// 	// case "rect":
		// 	// 	// 	rectMode(CENTER);
		// 	// 	// 	rect(0, 0, this.w, this.h);
		// 	// 	// 	break;

		// 	// 	default:
		// 	// 		textAlign(CENTER);
		// 	// 		text("there is no geometry", 0, 0)
		// 	// 		break;
		// 	// }
		// }


		pop();
	}

	regularDraw(){
		push();

		translate(-camOffset.x, -camOffset.y);
		translate(this.body.position.x, this.body.position.y);

         //приближение или отдаление
        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))

  		scale(zoom, zoom);

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

	oldContractionDraw(){
		push();

		translate(-camOffset.x, -camOffset.y);
		translate(this.body.position.x, this.body.position.y);


			//Distance contraction:
		translate((referenceBody.body.position.x - this.body.position.x) * (1 - 1/this.gamma.x) * zoom, (referenceBody.body.position.y - this.body.position.y) * (1 - 1/this.gamma.y) * zoom);

         	//приближение или отдаление
        translate(- (referenceBody.body.position.x - this.body.position.x) * (zoom-1), - (referenceBody.body.position.y - this.body.position.y) * (zoom-1))
        
        	//Length contraсtion:
		scale(1/this.gamma.x, 1/this.gamma.y);

  		scale(zoom, zoom);


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

	afterDraw(){
		if(DEBUG_MODE){
			push();
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
		this.previousVelocity = mySub(this.body.position, this.body.positionPrev); //Нужно вычитать препредыдущую скорость из предыдущей

		if(myMagnitude(this.body.velocity) > upperSpeed){ //0.9964
				console.log("upperSpeed");
				Matter.Body.setVelocity(this.body, myChangeMag(this.body.velocity, upperSpeedMinus*0.9999))
				
		} else if (this.body.velocity == NaN) { //Возможно происходит из-за неточности вычислений с большой десятичной частью, как у скоростей очень близких к скорости смеха. Попробовать использовать decimal.js или math.js для точных вычислений и операций с матрицами и векторами
			console.log("NaN");
			Matter.Body.setVelocity(this.body, myChangeMag(this.previousVelocity, upperSpeedMinus*0.9999))
		}

		// this.GammaO = Math.min(1/(Math.sqrt(Math.max(1-myMagnitude(this.body.velocity)**2/c**2), 0)), maxGamma);
		this.GammaO = 1/(Math.sqrt(1-myMagnitude(this.body.velocity)**2/c**2));

		if(myMagnitude(this.relVel) >= c){
			console.log(true, this.GammaO);
		}
		this.relVel = relativeVelocity2(this.body.velocity, referenceBody.body.velocity, this.GammaO); //Скорость объекта относительно точки отсчёта. Инвертирована, формула неправильная
		// this.relSpeed = relativeSpeed(this.body.velocity, referenceBody.body.velocity)


        this.gamma.x = 1/(Math.sqrt(1 - (this.relVel.x / c)**2)); //Сделать изменение гаммы плавным lerp()
        this.gamma.y = 1/(Math.sqrt(1 - (this.relVel.y / c)**2)); // /Math.SQRT2

        this.Gamma = 1/Math.sqrt(1 - myMagnitude(this.relVel)**2/c**2);

        //Length contraction alternative:
        // this.body.position = myAdd(this.body.position, myMult(this.body.velocity, this.Gamma - 1));
        // this.body.position.x += this.body.velocity.x * (this.Gamma - 1);
        // this.body.position.y += this.body.velocity.y * (this.Gamma - 1);
        // this.body.timeScale *= this.Gamma;
        // Matter.Body.setPosition(this.body, myAdd(this.body.position, myMult(this.relVel, (this.Gamma - 1)))); //Когда включено нивилирует сокращение расстояний(почему?)
		Matter.Body.setPosition(this.body, myAdd(this.body.position, myMult(this.body.velocity, (staticPointGamma - 1))));

	}

	attract(body){
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
		var dir = myNormalize(mySub(thisPos, bodyPos));
		bodyToPull.parentObject.applyForce(myMult(dir, force));
	}

	applyForce(force){
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

		var acc = myDiv(mySub(force, myMult(this.relVel, myScalarMult(this.relVel, force)/(c**2))), this.body.mass * this.Gamma);
		// var acc = myDiv(force, this.body.mass * this.Gamma**3)
		Matter.Body.applyForce(this.body, this.body.position, myMult(acc, this.body.mass));
	}
}