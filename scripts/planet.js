class Planet extends StellarBody{
	constructor(x, y, r, g, color = "turquoise"){
		super(x, y, r, color);
		// this.body.mass = (g/10) * r**2 / G; // /10 - почему-то гравитация на поверхности в 10 раз больше чем надо
		this.body.mass = (g * Planet.gOnEarth) * r**2 / G;
		// console.log(g);
	}
	static gOnEarth = 0.0003141;

	static Earth(x, y){
		return new Planet(x, y, 400, 1, "#5A4522") //0.003141, 0.001741, "darkgreen"
	}
}