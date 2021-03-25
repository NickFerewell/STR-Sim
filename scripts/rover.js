class Rover extends SimpleBody{
	constructor(x, y, w, h, r){
		super();
		this.body = Matter.Composites.car(x, y, w, h, r);
		this.body.mass = 50;
		World.add(world, this.body);
	}
	draw(){
		for(var i = 0; i < this.body.bodies.length; i++){
			const bodyPart = this.body.bodies[i];

			push();
			fill(bodyPart.render.fillStyle);
			stroke(117);

			// translate(width, height);

			translate(width/2, height/2);
			// rotate(- referenceBody.body.angle%(2*PI));
			// rotate(-referenceBody.interpolatedAngle);

			translate(-bodyPart.position.x, -bodyPart.position.y);

			translate(bodyPart.position.x - referenceBody.body.position.x, bodyPart.position.y - referenceBody.body.position.y);




			// translate(bodyPart.position.x - referenceBody.body.position.x + width/2, bodyPart.position.y - referenceBody.body.position.y + height/2);
			


			switch (bodyPart.type) {
				case "Circle Body":
				ellipseMode(RADIUS);
					circle(0, 0, bodyPart.circleRadius);
					break;

				case "body":
					beginShape();
					bodyPart.vertices.forEach( function(vert) {
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
			pop();
		}
	}
	
	attract(){
		var bodyPos;
		var bodyMass;
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
		var force = G * (thisMass * bodyMass) / (myDist(bodyPos, thisPos))**2;
		var dir = myNormalize(mySub(bodyPos, thisPos));
		// console.log(mult1(dir, force));
		Matter.Body.applyForce(bodyToPull, bodyPos, myMult(dir, force));
	}
}