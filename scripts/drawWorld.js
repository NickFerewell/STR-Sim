

function drawWorld(){
	background(0);

	if(keyboard.Plus){
    	changeZoom(1, 0.5);
    }
    if(keyboard.Minus){
    	changeZoom(-1, 0.5);
    }

	drawBackgroundUniverse();

	bodies.forEach(body => {
        body.draw();
    });
}