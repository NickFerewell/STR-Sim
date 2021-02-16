class SpaceBody {
    constructor(pos = createVector(0, 0), vel = createVector(0,0)){
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector();
        this.mass = 1;
        this.gamma = createVector(1, 1);
        this.scale = 60;
        this.rotation = 0; //in radians
        this.geometry = { //RotoriCraft - од для Minecraft Bedrock Edition, добавляющий роторы и другие механизмы паровой эры, все они работают на угле, как печи и помогают со сложностями, но и добавляют новых - их нужно сначала построить
            type: "circle",
            shape: [[0,0],[1,0],[1,1],[0,1]],
            r: 1,
            rotation: 0,
            color: "white",
            isFilling: 0,
            centreShiftX: 0,
            centreShiftY: 0,
        };
        bodies.push(this);
    }

    update() {
        this.pos.add(this.vel);
        if(this.vel.copy().add(this.acc).mag() >= c){ //v + a > c    v + b <c  c - acc.mag()
            while (this.vel.copy().add(this.acc).mag() >= c) {
                this.acc.mult(0.99);
            }
        } else {
            this.vel.add(this.acc);
        }
          //вектор скорости может быть больше скорости света из-за того, что его компоненты по отдельности могут приблизиться к скорости света
        this.acc.mult(0);
        // var relVel = relativeVelocity(this.vel, referenceObject.vel);
        // console.log(relVel.mag());

        var relVel = relativeVelocity(this.vel, referenceObject.vel);
        this.gamma.x = Math.min(1/(Math.sqrt(1 - (relVel.x / c)**2)), maxGamma);
        this.gamma.y = Math.min(1/(Math.sqrt(1 - (relVel.y / c)**2)), maxGamma);
    }

    draw() {
        push();
        if(lengthContractionMode){
            translate(this.pos.x - camOffset.x - (referenceObject.pos.x - this.pos.x) * (zoom-1) - (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x), this.pos.y - camOffset.y - (referenceObject.pos.y - this.pos.y) * (zoom-1) - (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y));
        } else {
            translate(this.pos.x - camOffset.x - (referenceObject.pos.x - this.pos.x) * (zoom-1) + (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x), this.pos.y - camOffset.y - (referenceObject.pos.y - this.pos.y) * (zoom-1) + (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y));
        }
        rotate(this.rotation + this.geometry.rotation);
        scale(zoom, zoom); //приближение или отдаление
        scale(1/this.gamma.x, 1/this.gamma.y);
        if(this.geometry.isFilling){
            fill(this.geometry.color);
        } else {noFill()}
        stroke(170);

        if(this.geometry.type == "circle"){
            circle(0, 0, this.scale);
        } else if(this.geometry.type == "point"){
            stroke(255);
            // strokeWeight(this.scale);
            point(createVector());
        } else if (this.geometry.shape != null){
            let offset = this.scale / 2
            push();

            beginShape();
            this.geometry.shape.forEach(vert => {
                // vertex((vert[0] * this.scale)/this.gamma.x - (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x) + this.geometry.centreShiftX, (vert[1] * this.scale) / this.gamma.y  - (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y) + this.geometry.centreShiftY); //если zoom = 1, то вертекс рисуется на расстоянии от точки осчёта, хотя его позиция на экране уже передвинута туда.(сдвинут дважды, требует исправления)
            
                vertex((vert[0] * this.scale) + this.geometry.centreShiftX, (vert[1] * this.scale) + this.geometry.centreShiftY); //если zoom = 1, то вертекс рисуется на расстоянии от точки осчёта, хотя его позиция на экране уже передвинута туда.(сдвинут дважды, требует исправления)
            });
            endShape(CLOSE);
            pop();
        } else {
            text("there is no geometry", this.pos.x, this.pos.y);
        }

        if(SHOW_BOUNDING){
            stroke(0, 225, 0);
            noFill();
            ellipse(0, 0 , this.r * 2);

            rotate(-this.geometry.rotation - this.rotation);
            var velo = this.vel.copy();
            drawArrow(createVector(0,0), velo.mult(FPS * zoom/* или this.r */), 'red');
        }
        pop();


        // vertex((vert[0] * this.scale) - (referenceObject.pos.x - this.pos.x) * zoom, (vert[1] * this.scale) - (referenceObject.pos.y - this.pos.y) * zoom);


        // if(this.geometry.type == "circle"){
        //     circle(this.pos.x, this.pos.y, this.scale);
        // } else if(this.geometry.type == "point"){
        //     push();
        //     stroke(255);
        //     strokeWeight(this.scale);
        //     point(this.pos);
        //     pop();
        // } else if (this.geometry.shape != null){
        //     let offset = this.scale / 2
        //     push();
        //     translate(this.pos.x - offset - camOffset.x, this.pos.y - offset - camOffset.y);
        //     rotate(this.rotation);

        //     scale(zoom, zoom); //приближение или отдаление
        //     beginShape();
        //     this.geometry.shape.forEach(vert => {
        //         vertex((vert[0] * this.scale) - (referenceObject.pos.x - this.pos.x) * zoom, (vert[1] * this.scale) - (referenceObject.pos.y - this.pos.y) * zoom);
        //     });
        //     endShape(CLOSE);
        //     pop();
        // } else {
        //     text("there is no geometry", this.pos.x, this.pos.y);
        // }
    }

    applyForce(force) {
        // let f = p5.Vector.div(force, this.mass);
        var accX = ((force.x - (this.vel.x**2 * force.x) / c**2)) / (this.mass * this.gamma.x);
        var accY = ((force.y - (this.vel.y**2 * force.y) / c**2)) / (this.mass * this.gamma.y);
        var acc = createVector(accX, accY);

        this.acc.add(acc);
    }

    attract(body) {
        let force = p5.Vector.sub(this.pos, body.pos);
        let distanceSq = force.magSq();

        let strength = constrain(G * (this.mass * body.mass) / distanceSq, 0, 2);
        
        force.setMag(strength);

        body.applyForce(force);
    }
}


//vertex((vert[0] * this.scale) / this.gamma.x  - (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x) - (referenceObject.pos.x - this.pos.x) * (1-zoom), (vert[1] * this.scale) / this.gamma.y  - (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y) - (referenceObject.pos.y - this.pos.y) * (1 - zoom));
