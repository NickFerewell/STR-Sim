class Ground extends SimpleBody{
	constructor(x, y, w, h){
		super();
		this.type = "rect";
		var options = {
			slop: 0,
			restitution: 0.6,
			isStatic: true
		}
		this.body = Bodies.rectangle(x, y, w, h, options);
		this.w = w;
		this.h = h;
		World.add(world, this.body);
	}
}