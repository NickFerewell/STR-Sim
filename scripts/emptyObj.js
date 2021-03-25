class Empty{
	constructor(){
		this.body = {
			position: {x: 0, y: 0},
			velocity: {x:0, y: 0},
			verticies: [],
			circleRadius: 0,
			mass: 1,
			angle: 0,
			force: {x: 0, y: 0}
		}
		this.Gamma = 1,
		this.gamma = {x: 0, y: 0}
	}
	draw(){
		push();
		scale(20);
		fill(255);
		point(this.body.position.x - referenceBody.position.x, this.body.position.y - referenceBody.position.y);
		pop();
	}
}