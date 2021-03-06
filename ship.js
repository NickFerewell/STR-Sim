class Ship extends SpaceBody{
    constructor(pos, vel){
        super(pos, vel);
        this.geometry.type = "concave line";
        this.geometry.shape = [];
        this.scale = 20;
        this.mass = 10;
        this.angularVel = 0;

        this.geometry.shape.push( //[0,-1],[1,1],[-1,1]
            [1,-1],[1,2],[0,2],[0,1],[-1,1],[-1,0],[-2,0],[-2,-1]
        )
        this.geometry.rotation = - PI/4;
        this.geometry.centreShiftY = 10; //почему координаты инвертированны?
        this.geometry.centreShiftX = -10;
    }

    update(){
        if(keyboard.rightArrPressed && keyboard.leftArrPressed){
            this.setRotation(0);
        } else if(keyboard.rightArrPressed){
            this.setRotation(0.1);
        } else if(keyboard.leftArrPressed){
            this.setRotation(-0.1);
        } else{
            this.setRotation(0);
        }
        this.rotation += this.angularVel;

        if(keyboard.upArrPressed){
            this.boost();
        }

        super.update();

        if(keyboard.spacePressed){
          var veloc = this.vel.copy();
          this.acc = veloc.mult(-0.05);
        }
    }

    draw(){
        push();
        super.draw();

        if(SHOW_BOUNDING){
            stroke(200);//срединная debug-точка
            strokeWeight(5);
            point(width/2, height/2);

            fill(255, 100, 100);
            textSize(13);
            stroke(1);
            // text("V: " + Math.floor(this.vel.mag()) + " units per second", width/2 + 20, height/2 - 20); //сделать либо в углу экрана, либо рисовать в основном классе и сделать специальное место для текста в геометрии.
            text("Vx: " + Math.floor(this.vel.x/c*100) + "% of c", width/2 + 20, height/2 - 20);
            text("Vy: " + Math.floor(this.vel.y/c*100) + "% of c", width/2 + 20, height/2 - 8);
            pop();
        }

    }

    boost(){
        var force = p5.Vector.fromAngle(this.rotation - PI/2);
        // var accX = force.x / (this.mass * this.gamma.x);
        // var accY = force.y / (this.mass * this.gamma.y);
        // var acc = createVector(accX, accY);

        // var accX = force.x / (this.mass);
        // var accY = force.y / (this.mass);
        // var acc = createVector(accX, accY);

        var accX = ((force.x - (this.vel.x**2 * force.x) / c**2)) / (this.mass * this.gamma.x);
        var accY = ((force.y - (this.vel.y**2 * force.y) / c**2)) / (this.mass * this.gamma.y);
        var acc = createVector(accX, accY);

        // var acc = force.div(this.mass * this.gamma.vector.mag()**3);

        // var accX = ((force.x - (this.vel.x**2 * force.x) / c**2)) / (this.mass * this.gamma.x);
        // var accY = ((force.y - (this.vel.y**2 * force.y) / c**2)) / (this.mass * this.gamma.y);
        // var acc = createVector(accX, accY);

        this.acc.add(acc);
    }

    setRotation(a) {
        this.angularVel = a * 0.66;
    }
    
    turn() {
        this.rotation += this.angularVel;
    }
}