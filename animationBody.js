class AnimationBody extends SimpleBody{
	constructor(x, y, geometry){
		super();

		geometry = _.merge(_.cloneDeep(newGeometries.standartGeometry), geometry);

		this.parts = geometry.shapes;
		this.rotation = geometry.rotation; //сдвиг, shift
		this.scale = geometry.scale;
		this.shift = geometry.position;
		
		for(var i = 0; i < this.parts.length; i++){
			this.parts[i] = _.merge(_.cloneDeep(newGeometries.standartGeometry.shapes[0]), this.parts[i]);
		};

		// this.body = Bodies.fromVertices(x, y, newGeometries.standartGeometry.shapes[0].vertexes, this.options);
		var newVerts = [];

		for(var i = 0; i < this.parts.length; i++){
			const shape = this.parts[i];
			if(shape.isPhysical == true){		
				var verts = [];	
				shape.vertexes.forEach( function(vert, index) {
					verts.push({x: vert.x * geometry.scale.x * shape.scale.x, y: vert.y * geometry.scale.y * shape.scale.y})
				});

				for(var i = 0; i < verts.length; i++){
					var vert = verts[i];
					var rotatedX = vert.x * Math.cos(this.rotation) - vert.y * Math.sin(this.rotation);
			        var rotatedY = vert.x * Math.sin(this.rotation) + vert.y * Math.cos(this.rotation);
			        newVerts.push({x: rotatedX, y: rotatedY});	
				}

				this.body = Bodies.fromVertices(x, y, newVerts, this.options);
			}
		};

		World.add(world, this.body);
		console.log(this.parts)
	}

	draw(){
		super.draw();
		this.drawAnimationParts();
	}
	regularDraw(){
		super.regularDraw();
		this.drawAnimationParts();
	}
	oldContractionDraw(){
		super.oldContractionDraw();
		this.drawAnimationParts();
	}

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
				

				translate(this.body.position.x, this.body.position.y);
				// translate(-referenceBody.body.position.x, -referenceBody.body.position.y);
				// translate(width/2, height/2);

					//camera offset:
				// translate(width/2, height/2);
				// translate(-referenceBody.body.position.x, -referenceBody.body.position.y);
				translate(-camOffset.x, -camOffset.y);

				translate((this.body.position.x - referenceBody.body.position.x)*(zoom-1), (this.body.position.y - referenceBody.body.position.y)*(zoom-1));
				rotate(figureToRender.angle + this.body.angle); //+this.rotation
				translate(this.shift.x * this.scale.x * zoom + figureToRender.position.x * zoom, this.shift.y * this.scale.y * zoom + figureToRender.position.y * zoom);

				scale(zoom, zoom);
				//Переделать названия настроек, чтобы совпадали с p5-овскими или настройками в разделе render тела из Matter.js
				if(figureToRender.fill){
					fill(figureToRender.color);
				} else {
					noFill();
				}
				stroke(figureToRender.outline);
				strokeWeight(figureToRender.stroke);
				if(figureToRender.isStrokeScaling == true){
					scale(this.scale.x, this.scale.y)
					scale(figureToRender.scale.x, figureToRender.scale.y);
				}

				switch (figureToRender.type) {
					case "circle":
					ellipseMode(RADIUS);
						circle(0, 0, figureToRender.r);
						break;

					case "concave line":
						beginShape();
						if(!figureToRender.isStrokeScaling){
							for(var i = 0; i < figureToRender.vertexes.length; i++){
								const vert = figureToRender.vertexes[i];
								// vertex((vert.x - referenceBody.body.position.x) * this.scale.x * figureToRender.scale.x + width/2, (vert.y - referenceBody.body.position.y)* this.scale.y * figureToRender.scale.y + height/2);
							};
						} else {
							figureToRender.vertexes.forEach( function(vert) {
								// vertex(vert.x * figure.scale.x + figure.position.x, vert.y * figure.scale.y + figure.position.y);
								vertex(vert.x, vert.y);
							});
						}
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