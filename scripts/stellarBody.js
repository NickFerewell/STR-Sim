class StellarBody extends SimpleBody{ //new Planet(x,y, r, gravity on surface) pull of gravity
	constructor(x, y, r, color = "#14151f"){
		super();
		stellarBodies.push(this);
		this.type = "StellarBody";
		// console.log(this.options)
		this.options.isStatic = true,
		this.options.mass = r; //r/2;
		this.body = Bodies.circle(x, y, r, this.options);
		this.body.render.fillStyle = color;
		World.add(world, this.body);

		this.velocityPrev = {x: 0 , y: 0};
	}

	//force:
	// x: 0.0018080548743725014
	// y: -0.0026207338255005677
	//Идеальная гравитация для корабля массой 10 и плотностью 0.014285714285714285



	// attract(body){
	// 	var force = G * (this.body.mass * body.mass) / (myDist(body.position, this.body.position))**2;
	// 	var dir = myNormalize(mySub(body.position, this.body.position));
	// 	// console.log(mult1(dir, force));
	// 	Matter.Body.applyForce(body, body.position, myMult(dir, force));
	// }
}