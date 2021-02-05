class RelatavisticBody {
    constructor(pos = createVector(0, 0), vel = createVector(0,0)){
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector();
        this.gamma = {
            x:1,
            y:1,
            vector: createVector(),//убрать, если не нужно, потому что это всё равно нагружает
        };
        this.mass = 1;
        this.scale = 60;
        this.rotation = 0; //in radians
        this.geometry = {
            type: "circl",
            shape: [[0,0],[1,0],[1,1],[0,1]],
        };
        bodies.push(this);
    }

    update() {
        if(referenceObject == this){
            this.pos.add(this.vel.copy().mult(this.gamma.vector.mag()));//может быть правильно умножать толко скорость reference object'а
        }else{
            this.pos.add(this.vel);
        }
        this.vel.add(this.acc);  //вектор скорости может быть больше скорости света из-за того, что его компоненты по отдельности могут приблизиться к скорости света
        this.acc.mult(0);
        var relVel = relativeVelocity(this.vel, referenceObject.vel);
        // console.log(relVel.mag());
        this.gamma.x = 1/(Math.sqrt(1 - (relVel.x / c)**2));
        this.gamma.y = 1/(Math.sqrt(1 - (relVel.y / c)**2));
        this.gamma.vector.x = this.gamma.x;
        this.gamma.vector.y = this.gamma.y;  //можно переписать через createVector()
    }

    draw() {
        if(this.geometry.type == "circle"){
            circle(this.pos.x, this.pos.y, this.scale);
        } else if(this.geometry.type == "point"){
            push();
            stroke(255);
            strokeWeight(this.scale);
            point(this.pos);
            pop();
        } else if (this.geometry.shape != null){
            let offset = this.scale / 2
            push();
            translate(this.pos.x - offset - camOffset.x, this.pos.y - offset - camOffset.y);
            rotate(this.rotation);
            // if(this.vel.mag() != 0){
            //     scale(this.gamma.x, this.gamma.y);
            // }

            scale(zoom, zoom); //приближение или отдаление
            beginShape();
            this.geometry.shape.forEach(vert => {
                vertex((vert[0] * this.scale) / this.gamma.x  - (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x) - (referenceObject.pos.x - this.pos.x) * zoom, (vert[1] * this.scale) / this.gamma.y  - (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y) - (referenceObject.pos.y - this.pos.y) * zoom);
            });
            endShape(CLOSE);
            pop();
        } else {
            text("there is no geometry", this.pos.x, this.pos.y);
        }
    }
}


//vertex((vert[0] * this.scale) / this.gamma.x  - (referenceObject.pos.x - this.pos.x) * (1 - 1/this.gamma.x) - (referenceObject.pos.x - this.pos.x) * (1-zoom), (vert[1] * this.scale) / this.gamma.y  - (referenceObject.pos.y - this.pos.y) * (1 - 1/this.gamma.y) - (referenceObject.pos.y - this.pos.y) * (1 - zoom));
