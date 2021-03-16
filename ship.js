class Ship extends SimpleBody{
	constructor(x, y, ){
		super();
		// this.options.mass = 100000;
		this.turningSpeed = 0.0025; //0.0006, 0.04
		this.options.mass = 10; //10

		this.isBoosting = false;
		this.turningSide = 0;
		this.isTurningRight = false;
		this.rotation = newGeometries.ship.rotation;

		// this.options.friction = 0;
		// var verts = [{x:-15, y: -15}, {x: -15, y:15}, {x: 15, y:0}];
		var verts = [];
		// geometries.ship.shapes[0].vertexes.forEach( function(vert, index) {
		// 	verts.push({x: vert[0] + 3, y: vert[1] + 3,
		// 	 // index: index, body: undefined, isInternal: false
		// 	});
		// });
		// this.animationParts = [];
		// console.log(this.animationParts)

		this.parts = newGeometries.ship.shapes;
		
		this.parts.forEach( function(part, index) {
			part = myExtend(myClone(newGeometries.standartGeometry.shapes[0]), part);
			// part.shapes.forEach( function(shape, index) {
			// 	myExtend(shape, newGeometries.standartGeometry.shapes[0])
			// });
			console.log(part)
		});
		console.log(newGeometries.standartGeometry.shapes[0])
		console.log(this.parts)
		

		newGeometries.ship.shapes.forEach( function(shape, index) {
			// console.log(shape)
			if(shape.isPhysical == true){			
				shape.vertexes.forEach( function(vert, index) {
				verts.push({x: vert.x * newGeometries.ship.scale.x * shape.scale.x, y: vert.y * newGeometries.ship.scale.y * shape.scale.y})
			});
			}
		});

		// for(var i = 0; i < newGeometries.ship.shapes.length; i++){

		// 	// console.log(referenceBody)
		// 	// console.log(this);
		// 	// console.log(this.animationParts);
		// 	if(newGeometries.ship.shapes[i].isPhysical == false){
		// 		// this.animationParts[newGeometries.ship.shapes[i].label] = newGeometries.ship.shapes[i];
		// 		this.animationParts.push(newGeometries.ship.shapes[i]);
		// 	}
		// }
		// console.log(this.animationParts)
		console.log(newGeometries.ship.shapes);
		console.log(this.parts);
		// verts = [
	 //        {x : 0 , y : 0},
	 //        {x : 0 , y : 50},
	 //        {x : 25 , y : 25},
	 //        {x : 50 , y : 50},
	 //        {x : 50 , y : 0}
		// ];


		// console.log(verts);
		// var angle = PI/4;
		// var angle = PI/4;
		// verts = [
		// 	{x: 10, y: -10},
		// 	{x: 10, y: 20},
		// 	{x: 0, y: 20},
		// 	// {x: 0, y: 10},
		// 	// {x: -10, y: 10},
		// 	// {x: -10, y: 0},
		// 	{x: -20, y: 0},
		// 	{x: -20, y: -10}
		// ]
		var newVerts = [];
		// console.log(verts);
		
		// verts.forEach( function(vert, index) {
		// 	// var x = (vertex[0] + geometry.position[0] + shape.position[0]) * geometry.scale[0] * shape.scale[0];
	 //  //       var y = (vertex[1] + geometry.position[1] + shape.position[1]) * geometry.scale[1] * shape.scale[1];
	 //        // var angle = geometry.angle;
	 //        var rotatedX = vert.x * Math.cos(this.rotation) - vert.y * Math.sin(this.rotation);
	 //        var rotatedY = vert.x * Math.sin(this.rotation) + vert.y * Math.cos(this.rotation);
	 //        newVerts.push({x: rotatedX, y: rotatedY});	
		// });

		for(var i = 0; i < verts.length; i++){
			var vert = verts[i];
			var rotatedX = vert.x * Math.cos(this.rotation) - vert.y * Math.sin(this.rotation);
	        var rotatedY = vert.x * Math.sin(this.rotation) + vert.y * Math.cos(this.rotation);
	        newVerts.push({x: rotatedX, y: rotatedY});	
		}

		// console.log(newVerts)
		this.body = Bodies.fromVertices(x, y, newVerts, this.options);
		// Matter.Body.setAngle(this.body, -PI/2);
		this.interpolatedAngleOld = this.body.angle;
		this.interpolatedAngle = this.body.angle;
		World.add(world, this.body);
		// console.log(this.body);
	}

	update(){
		this.interpolatedAngle = lerp(this.interpolatedAngleOld, this.body.angle, 0.09);
		this.interpolatedAngleOld = this.interpolatedAngle;
		// Matter.Body.setAngle(this.body, this.body.angle %(2*PI));
		if(keyboard.W || keyboard.upArrPressed){
			Matter.Body.applyForce(this.body, this.body.position, p5.Vector.fromAngle(this.body.angle - PI/2).mult(0.004)); //this.body.Force.x += force;
			this.isBoosting = true;
		} else{
			this.isBoosting = false;
		}
		// console.log(this.body.force)
		// Matter.Body.rotate(this.body, -this.turningSpeed);
		// this.body.angle += -this.turningSpeed;
		if(keyboard.A || keyboard.leftArrPressed){
			this.body.torque += -this.turningSpeed;
			this.turningSide = -1;
			this.isTurningRight = true;
		} else {this.turningSide = 0; this.isTurningRight = false;}
		// Matter.Body.rotate(this.body, this.turningSpeed);
		// this.body.angle += this.turningSpeed;
		if(keyboard.D || keyboard.rightArrPressed){
			this.body.torque += this.turningSpeed;
			this.turningSide = 1;
		} else {this.turningSide = 0;}
	}
	draw(){
		super.draw();
		this.drawAnimationParts();

		// //Animation
		// push();

		// translate(width/2, height/2);
		// // translate(-this.body.position.x, -this.body.position.y);
		// translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);
		// rotate(this.animationParts["main engine"].angle + this.body.angle);
		// console.log(this.animationParts["main engine"]);

		// if(this.isBoosting){
		// 	translate(this.animationParts["main engine"].position.x, this.animationParts["main engine"].position.y);
		// 	fill(this.animationParts["main engine"].color)
		// 	// translate(this.animationParts["main engine"].position.x, 100);
		// 	// console.log(this.animationParts["main engine"].position.x)
		// 	// circle(0, 0, 5)
		// 	// console.log(this.animationParts["main engine"].position)
		// 	beginShape();
		// 	// console.log(this.animationParts["main engine"])
		// 	// this.animationParts["main engine"].vertexes.forEach(function(vert){
		// 	// 	vertex(vert.x * this.animationParts["main engine"].scale.x, vert.y * this.animationParts["main engine"].scale.y);
		// 	// })
		// 	for(var i = 0; i < this.animationParts["main engine"].vertexes.length; i++){
		// 		vertex(this.animationParts["main engine"].vertexes[i].x * this.animationParts["main engine"].scale.x, this.animationParts["main engine"].vertexes[i].y * this.animationParts["main engine"].scale.y);
		// 	}
		// 	endShape();
		// }
		// pop();
		// console.log(this.animationParts)
		// console.log(this)
	/*	push();
		for(var i = 0; i < this.animationParts.length; i++){
			var part = this.animationParts[i];
			if(part.animCondition !== undefined || part.animCondition !== null){
				if(this[part.animCondition] !== undefined && this[part.animCondition] !== null && this[part.animCondition] == part.animConditionValue){
					if(("animation" in this.animationParts[i]) && this.animationParts[i].animation.length > 0){
						//draw(new)
						// this.drawAnimationPart(part, newOptions)
					} //else draw(old);
				} //don't draw()
			} else if(("animation" in this.animationParts[i]) && this.animationParts[i].animation.length > 0){
				//draw(new);
			} //else draw(old);  

			/*
			if(this[part.animCondition] !== undefined && this[part.animCondition] !== null){
				if(this[part.animCondition]){
					var newOptions;
					var currentAnimStep;

					if(("animation" in this.animationParts[i]) && this.animationParts[i].animation.length > 0){
						if(part.currentStep.timeLeft <= 0){
							part.currentStep.stepNum = (part.currentStep.stepNum + 1) % this.animationParts[i].animation.length;
							part.currentStep.timeLeft = this.animationParts[i].animation[part.currentStep.stepNum].time;
						}
						// console.log(part.currentStep.stepNum)
						// console.log(part.currentStep.timeLeft)

						part.currentStep.timeLeft--;

						currentAnimStep = part.animation[part.currentStep.stepNum];

						// console.log("JHKSOJ")

						newOptions = myExtend(myClone(this.animationParts[i], true), currentAnimStep.options);
					} else{
						newOptions = this.animationParts[i];
					}
					push();

					if(newOptions.fill){
						fill(newOptions.color);
					} else {
						noFill();
					}
					stroke(newOptions.outline);
					strokeWeight(newOptions.stroke);

					// translate(width, height);

					translate(width/2, height/2);
					// rotate(- referenceBody.body.angle%(2*PI));
					// rotate(-referenceBody.interpolatedAngle);
					translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);
					rotate(newOptions.angle + this.body.angle);

					// console.log(newOptions)
					switch (newOptions.type) {
						case "circle":
						ellipseMode(RADIUS);
							console.log(newOptions);
							circle(0, 0, newOptions.r);
							break;

						case "concave line":
							beginShape();
							// console.log("GHKS");
							newOptions.vertexes.forEach( function(vert) {
								vertex(vert.x * newOptions.scale.x + newOptions.position.x, vert.y * newOptions.scale.y + newOptions.position.y);
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
		// pop();
	*/

		// push();
  //       // translate(this.pos.x, this.pos.y);
  //       // rotate(this.heading + PI / 2);
  //       // fill(50);
        
  //       if(random() < 0.5){  //можно было просто каждый кадр менять значение на обратное и всё
  //         fill(100, 50, 30);
  //         strokeWeight(1);
  //         stroke(200, 200, 0);
  //       } else {
  //         fill(0);
  //         noStroke();
  //       }
        
        
  //       triangle(-this.r * 0.5, this.r, this.r * 0.5, this.r, 0, this.r*2);
  //       pop();
	}

	//Кориандр - кенза - петрушка(чихотное действие)

	drawAnimationParts(){ //Анимируются все части в принципе, но те у которых нет анимации просто рисуют себя
		// console.log(this.parts)
		for(var i = 0; i < this.parts.length; i++){
			var figure = this.parts[i];
			
			if(!("isRendering" in figure) || figure.isRendering == true){
				/*
				if("renderCondition" in figure && figure.label != "main engine"){
					console.log(figure.label, figure.renderCondition , figure.renderConditionValue, this[figure.renderCondition], this[figure.renderCondition] == figure.renderConditionValue)
				}

				if(figure.renderCondition !== undefined && figure.renderCondition !== null){
						
						// console.log(figure)
					if(figure.renderCondition in this //this[figure.renderCondition] !== undefined
						&& this[figure.renderCondition] !== null && this[figure.renderCondition] == figure.renderConditionValue){
						// console.log("HHHHHH")
						// console.log(figure.renderConditionValue)

						if(("animation" in figure) && figure.animation.length > 0){

							if(figure.currentStep.timeLeft < 0){
									figure.currentStep.stepNum = (figure.currentStep.stepNum + 1) % figure.animation.length;
									figure.currentStep.timeLeft = figure.animation[figure.currentStep.stepNum].time;
							}
							figure.currentStep.timeLeft--;
							// console.log("JHKSOJ")
							var tempFigure = myClone(figure, true);
							figure = null;
							figure = myExtend(tempFigure, tempFigure.animation[tempFigure.currentStep.stepNum].options); //Условие соблюдается и есть анимация - рисовать фигуру с настройками текущего шага анимации
						} //Так как нет анимации, то просто рисовать фигуру
					} else {
						if(("animation" in figure) && figure.animation.length > 0){
							if(!("isAnimContinuous" in figure) || figure.isAnimContinuous == false){
								// console.log(figure)
								figure.currentStep.stepNum = 0; figure.currentStep.timeLeft = figure.animation[0].time; 
							}
						}
						break;
					}//Условие не соблюдается - не рисовать эту фигуру и переходить к следующей
				} else {//рисовать без изменений фигуру(неверно. Нужно сначала проверить на наличие анимации и рисовать как сказано)
					// if(("animation" in figure) && figure.animation.length > 0){
					// 	if(figure.currentStep.timeLeft < 0){
					// 			figure.currentStep.stepNum = (figure.currentStep.stepNum + 1) % figure.animation.length;
					// 			figure.currentStep.timeLeft = figure.animation[figure.currentStep.stepNum].time;
					// 	}
					// 	figure.currentStep.timeLeft--;
					// 	figure = myExtend(myClone(figure, true), figure.animation[figure.currentStep.stepNum].options); //Условие соблюдается и есть анимация - рисовать фигуру с настройками текущего шага анимации
					// }
				}
				*/
				// console.log("jhsk")

				console.log(figure)
				if (figure.renderCondition == null || figure.renderCondition == undefined || ((figure.renderCondition in this) && (this[figure.renderCondition] == figure.renderConditionValue)) ||(!("renderConditionValue" in figure) && (this[figure.renderCondition] == true))){
					if(figure.currentStep.timeLeft <= 0){
						figure.currentStep.stepNum = (figure.currentStep.stepNum + 1) % (figure.animation.length);
						figure.currentStep.timeLeft = figure.animation[figure.currentStep.stepNum].time;
					}
					figure.currentStep.timeLeft--;
					// console.log("JHKSOJ")
					var tempFigure = myClone(figure, true);
					figure = null;
					// figure = myExtend(tempFigure, tempFigure.animation[tempFigure.currentStep.stepNum].options);
					figure = myExtend(tempFigure, tempFigure.animation[tempFigure.currentStep.stepNum].options);
				} else {
					if(("animation" in figure) && figure.animation.length > 0){
						if(!("isAnimContinuous" in figure) || figure.isAnimContinuous == false){
							// console.log(figure)
							figure.currentStep.stepNum = 0; figure.currentStep.timeLeft = figure.animation[0].time; 
						}
					}
					// break;//Проблема здесь. осталось только решить её
				}
				



				//Рисование фигуры. Заключить эту длинную функцию в раздел(такие вообще есть в js'е)
				push();
				//Переделать названия настроек, чтобы совпадали с p5-овскими или настройками в разделе render тела из Matter.js
				if(figure.fill){
					fill(figure.color);
				} else {
					noFill();
				}
				stroke(figure.outline);
				strokeWeight(figure.stroke);

				// translate(width, height);

				translate(width/2, height/2);
				// rotate(- referenceBody.body.angle%(2*PI));
				// rotate(-referenceBody.interpolatedAngle);
				translate(this.body.position.x - referenceBody.body.position.x, this.body.position.y - referenceBody.body.position.y);
				rotate(figure.angle + this.body.angle);
				translate(figure.position.x, figure.position.y);
				scale(figure.scale.x, figure.scale.y);

				// console.log(newOptions)
				switch (figure.type) {
					case "circle":
					ellipseMode(RADIUS);
						// console.log(figure);
						circle(0, 0, figure.r);
						break;

					case "concave line":
						beginShape();
						// console.log("GHKS");
						figure.vertexes.forEach( function(vert) {
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