var backgroundUniverse = []; //массив слоёв паралакса заднего фона
var layersNum = 4;
var backUniverseSize = 4; //5, 1/minZoom?, 1.5, 4
var starSize = 1; //1, 1.5, 8, 2
var starCount = backUniverseSize * 70; //backUniverseSize * 16 * 2 * 1.5,  backUniverseSize * 100
var parallaxSpeed = 0.4; //0.9, 0.3, 0.1
var backUniverseSizeW;
var backUniverseSizeH;

function generateBackgroundUniverse(){
	backUniverseSizeW = width * backUniverseSize;
	backUniverseSizeH = height * backUniverseSize;

	for (var i = 0; i < layersNum; i++) {
		backgroundUniverse.push([]);
		for (var j = 0; j < starCount; j++) {
			var newStar = {
				x: random(- backUniverseSizeW/2, backUniverseSizeW/2), 
				y: random(-backUniverseSizeH/2, backUniverseSizeH/2), 
				brightness: (layersNum - i) * random(0.5, 1.5),
				parLayerShift: random(-0.3, 0.3)
			}
			backgroundUniverse[i].push(newStar);
		}
	}
}

function drawBackgroundUniverse(){
	var referencePoint = {position: referenceBody.body.position, velocity: referenceBody.body.velocity};
	push();
	for (var i = 0; i < backgroundUniverse.length; i++) {

		backgroundUniverse[i].forEach( function(element, index) { 
			colorMode(HSB);
			fill(100 * element.brightness, 40, 15 * element.brightness);
			noStroke();
			var parLayerSpeed = parallaxSpeed / (i + 1 + element.parLayerShift);

			var newX = 0;
			var newY = 0;

			if(renderMode == 0){
				var x = ((-(referencePoint.position.x))*parLayerSpeed / zoom + element.x/zoom - (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2/zoom))% (backUniverseSizeW/zoom) + (backUniverseSizeW/2 /zoom) + (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2/zoom) - width/zoom;

				var y = ((-(referencePoint.position.y))*parLayerSpeed/zoom + element.y/zoom - (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2/zoom))% (backUniverseSizeH/zoom) + (backUniverseSizeH/2 /zoom) + (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2/zoom) - height/zoom;

				newX = x;
				newY = y;
			} else {
				// var starSpeed = relativeVelocity(myMult(referencePoint.velocity, parLayerSpeed), referencePoint.velocity);
				var starSpeed = rmath.sDiff(myMult(referencePoint.velocity, parLayerSpeed), referencePoint.velocity);

				var starGamma = 1 / Math.sqrt(1 - (starSpeed/c)**2);
				var direction = myHeading(referencePoint.velocity);

				var x = (-(referencePoint.position.x)*parLayerSpeed + element.x);
				var y = (-(referencePoint.position.y)*parLayerSpeed + element.y);

				newX = x;
				newY = y;

				if(Math.abs(newX) > backUniverseSizeW/2){
					newX = Math.sign(newX) * (- backUniverseSizeW) + (newX % backUniverseSizeW);
				}
				if(Math.abs(newY) > backUniverseSizeH/2){
					newY = Math.sign(newY) * (- backUniverseSizeH) + (newY % backUniverseSizeH);
				}

				newX -= Math.sign(newX)*backUniverseSizeW/2;
				newY -= Math.sign(newY)*backUniverseSizeH/2;

				newX *= zoom
				newY *= zoom
				//Length, distance contraction
				var tempCoords = myRotateVec({x: newX, y: newY}, -direction);
				tempCoords.x /= starGamma;
				newCoords = myRotateVec(tempCoords, direction);
				newX = newCoords.x;
				newY = newCoords.y;

				newX += width/2;
				newY += height/2;
			}
			
			var size = clamp(element.brightness * starSize * zoom, 0.32 * element.brightness * 2, 1000);
			circle(newX, newY, size);
		});
	}
	pop()
}