class Attractor extends SpaceBody{
    constructor(pos = createVector(0, 0), mass = 10, vel = createVector(0, 0)){
        super(pos, vel);
        this.mass = mass;
        this.geometry.r = sqrt(this.mass);
    }

    draw() {
        super.draw();
    }

    attract(body) {
        let force = p5.Vector.sub(this.pos, body.pos);
        // console.log()
        let distanceSq = force.magSq()
        // console.log(force.magSq())

        let strength = constrain(G * (this.mass * body.mass) / distanceSq, 0, 100);
        
        force.setMag(strength);

        body.applyForce(force);
    }

    update() {
        super.update();
        var veloc = this.vel.copy();
        this.acc = veloc.mult(-1);
        

        

        // this.pos.x = windowWidth / 2;
        // this.pos.y = windowHeight / 2;
        // this.vel.set(0.1, 0.1);
    }
    // edges() {
    //     if (this.pos.x > width + this.r) {
    //         this.pos.x = -this.r;
    //     } else if (this.pos.x < -this.r) {
    //         this.pos.x = width + this.r;
    //     }
    //     if (this.pos.y > height + this.r) {
    //         this.pos.y = -this.r;
    //     } else if (this.pos.y < -this.r) {
    //         this.pos.y = height + this.r;
    //     }
    // }
    // applyForce(force) {
    //     let f = p5.Vector.div(force, this.mass);
    //     this.acc.add(f);
    // }
}