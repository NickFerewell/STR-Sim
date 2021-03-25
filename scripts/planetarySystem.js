class PlanetarySystem{
	constructor(star, planets = []){
		this.star = star;
		this.planets = planets;
		for(var k = 0, length3 = this.planets.length; k < length3; k++){
			var planet = this.planets[k];
			var distance = planet.body.mass * 4 + star.body.circleRadius*2;
			// var distVec = myChangeDir({x: distance, y: 0}, random(-3.14, 3.14));
			var distVec = myVecfromAngle(distance, random(-3.14, 3.14));
			console.log(star.body.position, distance, Math.sqrt(G*star.body.mass*20/distance));
			Matter.Body.setPosition(planet.body, myAdd(star.body.position, distVec));
			// Matter.Body.setVelocity(planet.body, myChangeMag({x: -distVec.y, y: distVec.x}, Math.sqrt(G*star.body.mass/distance)));
			planet.orbitalVelocity = myChangeMag({x: -distVec.y, y: distVec.x}, Math.sqrt(G*star.body.mass*200/distance));
		}
		// star.orbitalVelocity = {x: 0, y: 0};
		// this.planets.push(star)
	}

	update(){
		// for(var k = 0, length3 = this.planets.length; k < length3; k++){
		// 	var planet1 = this.planets[k];
		// 	for(var j = 0, length4 = this.planets.length; j < length4; j++){
		// 		var planet2 = this.planets[j];
		// 		if(planet1 != planet2){
		// 			this.applyForce(planet2, this.calcForce(planet2, planet1));
					
		// 		}
		// 	}
		// }
		for(var k = 0, length3 = this.planets.length; k < length3; k++){
			var planet1 = this.planets[k];
			this.applyForce(planet1, this.calcForce(planet1, this.star));
		}
		for(var k = 0, length3 = this.planets.length; k < length3; k++){
			var planet = this.planets[k];
			planet.orbitalVelocity = myAdd(planet.orbitalVelocity, planet.body.force);
		}
		for(var k = 0, length3 = this.planets.length; k < length3; k++){
			var planet = this.planets[k];
			// console.log(planet.orbitalVelocity)
			Matter.Body.setPosition(planet.body, myAdd(planet.body.position, planet.orbitalVelocity));
		}
	}

	applyForce(body, force){
		// console.log(body.body, force)
		Matter.Body.applyForce(body.body, body.body.position, force);
		// body.body.applyForce(force)
	}

	calcForce(body1, body2){
		var force = (G * (body1.body.mass * body2.body.mass)) / (myDist(body1.body.position, body2.body.position))**2;
		var dir = myNormalize(mySub(body1.body.position, body2.body.position));
		// console.log(mult1(dir, force));
		// Matter.Body.applyForce(bodyToPull, bodyPos, myMult(dir, force));
		return myMult(dir, force);
	}
}