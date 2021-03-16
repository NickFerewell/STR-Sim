class Circle extends SimpleBody{
	constructor(x, y , r){
		super();

		this.body = Bodies.circle(x, y, r, this.options);
		World.add(world, this.body);
	}
}