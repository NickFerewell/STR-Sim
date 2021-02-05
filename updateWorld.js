function updateWorld() {
    camOffsetX = referenceObject.pos.x - width/2;
    camOffsetY = referenceObject.pos.y - height/2;
    camOffset = createVector(camOffsetX, camOffsetY);

    bodies.forEach(body => {
        body.update();
    });

    bodies.forEach(body => {
        body.draw();
    });
}
