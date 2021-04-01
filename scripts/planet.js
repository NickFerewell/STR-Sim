class Planet extends StellarBody{
	constructor(x, y, r, g, color = "turquoise"){ // g - gravity on surface in g's
		super(x, y, r, color);
		this.body.mass = (g * Planet.gOnEarth) * r**2 / G;
	}
	static gOnEarth = 0.0003141;

	static Earth(x, y){
		return new Planet(x, y, 400, 1, "#5A4522") //0.003141, 0.001741, "darkgreen"
	}
}