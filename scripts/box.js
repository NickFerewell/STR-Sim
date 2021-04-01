class Box extends SimpleBody{
	constructor(x, y, w, h, vx = 0, vy = 0){
		super();
		
		this.body = Bodies.rectangle(x, y, w, h, this.options);
		Matter.Body.setVelocity(this.body, {x: vx , y: vy});
		this.w = w;
		this.h = h;
		World.add(world, this.body);
	}
}