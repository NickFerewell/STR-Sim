class Asteroid extends SpaceBody{
	constructor(pos = createVector(), mass = 10, vel = createVector()){
        super(pos, vel);
        this.geometry.type = "concave line";
        this.geometry.shape = [];
        this.mass = mass;
        this.density = 0.1;//3
        this.r = sqrt(this.mass/(this.density*PI)); //random(15, 50);

        this.scale = 2;

        this.total = floor(random(5, 15));
        this.offset = []; //переделать в обычные переменные, чтобы не заполнять память
        for (var i = 0; i < this.total; i++) {
            this.offset[i] = random(-this.r*0.5, this.r*0.5);
        }
        for (var i = 0; i < this.total; i++) {
            var angle = map(i, 0, this.total, 0, TWO_PI);
            var r = this.r + this.offset[i];
            var x = r * cos(angle);
            var y = r * sin(angle);
            this.geometry.shape.push([x,y]);
        }
    }}