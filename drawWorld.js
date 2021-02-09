function drawWorld(){
	camOffsetX = referenceObject.pos.x - width/2;
    camOffsetY = referenceObject.pos.y - height/2;
    camOffset = createVector(camOffsetX, camOffsetY); //могут возникнуть проблем с получением актулальных данных в worldUpdate'е

    background(0);

	drawBackgroundUniverse();


    // push();
    // strokeWeight(5);
    // stroke(255);
    // line(0 - camOffset.x,7000 - camOffset.y,0 - camOffset.x,-7000 + camOffset.y);
    // line(-7000 - camOffset.x, 0 - camOffset.y, 7000 - camOffset.x, 0 - camOffset.y); //перенести в worldDraw()
    // pop();

    bodies.forEach(body => {
        body.draw();
    });

    push();
    stroke(0);
    strokeWeight(1);
    fill(255);
    text("FPS: " + currentFPS,2,11); //счётчик FPS
    pop();
}