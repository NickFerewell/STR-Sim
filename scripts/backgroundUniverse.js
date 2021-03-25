var backgroundUniverse = []; //массив слоёв паралакса заднего фона
var layersNum = 4;
var backUniverseSize = 5; //5, 1/minZoom?
var starSize = 1; //1, 1.5, 8, 2
var starCount = backUniverseSize * 16 * 2 * 1.5;//с двойкой лучше и красивее //количество звёзд на самом заднем уровне 20, 40. 400 для 5 размера вселенной. backUniverseSize * 80, backUniverseSize * 16
var parallaxSpeed = 0.9; //0.9, 0.3, 0.1
var backUniverseSizeW;
var backUniverseSizeH;

function generateBackgroundUniverse(){
	backUniverseSizeW = width * backUniverseSize; //width * 1/minZoom?
	backUniverseSizeH = height * backUniverseSize; //height * 1/minZoom

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

function drawBackgroundUniverse(){ //ЛАГАЕТ!((( //Делать это всё через GPU, чтобы не лагало. Тут происходит слишком много событий в секунду.
	var referencePoint = {position: referenceBody.body.position, velocity: referenceBody.body.velocity};
	push();
	for (var i = 0; i < backgroundUniverse.length; i++) {

		backgroundUniverse[i].forEach( function(element, index) { 
			colorMode(HSB); //HSV, value, lightness
			fill(100 * element.brightness, 40, 15 * element.brightness); //сделать звёзды чуть темнее , 100*,40,30*
			noStroke();
			var parLayerSpeed = parallaxSpeed / (i + 1 + element.parLayerShift);

			var newX = 0;
			var newY = 0;

			if(renderMode == 0){
				// var x = ((-(referencePoint.position.x))*parLayerSpeed + element.x - (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2))% (backUniverseSizeW) + (backUniverseSizeW/2) + (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2);
				var x = ((-(referencePoint.position.x))*parLayerSpeed / zoom + element.x/zoom - (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2/zoom))% (backUniverseSizeW/zoom) + (backUniverseSizeW/2 /zoom) + (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2/zoom) - width/zoom;

				// x -= (width/2 - x) * (zoom-1);

				// var y = ((-(referencePoint.position.y))*parLayerSpeed + element.y - (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2))% (backUniverseSizeH) + (backUniverseSizeH/2) + (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2);
				var y = ((-(referencePoint.position.y))*parLayerSpeed/zoom + element.y/zoom - (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2/zoom))% (backUniverseSizeH/zoom) + (backUniverseSizeH/2 /zoom) + (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2/zoom) - height/zoom;

				// y -= (height/2 - y) * (zoom-1);

				newX = x;
				newY = y;
			} else {
				/*
				var starSpeed = relativeVelocity(myMult(referencePoint.velocity, parLayerSpeed), referencePoint.velocity); //Можно преобразовать
				var starGamma = {x: 1, y: 1};
				// starGamma.x = 1 / Math.sqrt(1 - (starSpeed.x**2)/(c**2));
				starGamma.x = Math.min(1 / Math.sqrt(1 - (starSpeed.x / c)**2), maxGamma);
				starGamma.y = Math.min(1 / Math.sqrt(1 - (starSpeed.y / c)**2), maxGamma);


				var x = ((-(referencePoint.position.x))*parLayerSpeed + element.x - (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2))% (backUniverseSizeW) + (backUniverseSizeW/2) + (Math.sign(referencePoint.position.x))*(backUniverseSizeW/2)
				x -= (width/2 - x) * zoom;
				if(x > width/2){
					x = x / starGamma.x;
				} else{
					x = x * starGamma.x;
				}
				//скорость звезды относительно меня равна speed(Относительно корабля) = relVel(ship.vel, ship.vel * parLayerSpeed) делать это только для звёзд на экране, пожалуйста.
				//Значит их гамма равна 1/Math.sqrt(1-(starSpeed**2)/(c**2)
				//На далёких расстояниях от центра вселенной законы действуют по-другому.(>20000u)
				// console.log(backUniverseSizeW)

				var y = ((-(referencePoint.position.y))*parLayerSpeed + element.y - (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2))% (backUniverseSizeH) + (backUniverseSizeH/2) + (Math.sign(referencePoint.position.y))*(backUniverseSizeH/2)
				y -= (height/2 - y) * zoom;
				if(y > height/2){
					y = y / starGamma.y;
				} else{
					y = y * starGamma.y;
				}
				*/

				/*
				var starSpeed = relativeVelocity(myMult(referencePoint.velocity, parLayerSpeed), referencePoint.velocity); //Можно преобразовать
				var starGamma = {x: 1, y: 1};
				// starGamma.x = 1 / Math.sqrt(1 - (starSpeed.x**2)/(c**2));
				starGamma.x = 1 / Math.sqrt(1 - (starSpeed.x / c)**2), maxGamma;
				starGamma.y = 1 / Math.sqrt(1 - (starSpeed.y / c)**2), maxGamma;

				var x = (-(referencePoint.position.x)*parLayerSpeed + element.x);
				x /= starGamma.x;
				if(x > backUniverseSizeW/2){
					x = - backUniverseSizeW/2 + (x % backUniverseSizeW);
				} else if(x < -backUniverseSizeW/2){
					x = backUniverseSizeW/2 - (x % backUniverseSizeW);
				}
				x *= zoom;
				x += width/2;

				var y = (-(referencePoint.position.y)*parLayerSpeed + element.y);
				y /= starGamma.y;
				if(y > backUniverseSizeH/2){
					y = - backUniverseSizeH/2 + (y % backUniverseSizeH);
				} else if(y < -backUniverseSizeH/2){
					y = backUniverseSizeH/2 - (y % backUniverseSizeH);
				}
				y *= zoom;
				y += height/2;
				*/

				/*
				var starSpeed = relativeVelocity(myMult(referencePoint.velocity, parLayerSpeed), referencePoint.velocity); //Можно преобразовать
				var starGamma = 1 / Math.sqrt(1 - (myMagnitude(starSpeed)/c)**2);
				var direction = myHeading(referencePoint.velocity);

				var x = (-(referencePoint.position.x)*parLayerSpeed + element.x);
				var y = (-(referencePoint.position.y)*parLayerSpeed + element.y);

					//length contraction
				// var newX = x * Math.cos(direction) - y * Math.sin(direction);
				// newX /= starGamma;
				// newX = newX * Math.cos(-direction) - y * Math.sin(-direction);

				// var newY = x * Math.sin(direction) + y * Math.cos(direction);
				// newY /= starGamma;
				// newY = newX * Math.sin(-direction) + newY * Math.cos(-direction);

				
				var newCoords = myRotateVec({x: x, y: y}, -direction);
				newCoords.x /= starGamma;
				newCoords = myRotateVec(newCoords, direction);
				newX = newCoords.x;
				newY = newCoords.y;

				if(newX > backUniverseSizeW/2){
					newX = - backUniverseSizeW/2 + (newX % backUniverseSizeW);
				} else if(newX < -backUniverseSizeW/2){
					newX = backUniverseSizeW/2 - (newX % backUniverseSizeW);
				}
				newX *= zoom;
				newX += width/2;

				if(newY > backUniverseSizeH/2){
					newY = - backUniverseSizeH/2 + (newY % backUniverseSizeH);
				} else if(newY < -backUniverseSizeH/2){
					newY = backUniverseSizeH/2 - (newY % backUniverseSizeH);
				}
				newY *= zoom;
				newY += height/2;
				*/

				var starSpeed = relativeVelocity(myMult(referencePoint.velocity, parLayerSpeed), referencePoint.velocity); //*staticPointGamma
				var starGamma = 1 / Math.sqrt(1 - (myMagnitude(starSpeed)/c)**2);
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

				// newX *= zoom /starGamma
				// newY *= zoom /starGamma
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
			

			var size = clamp(element.brightness * starSize * zoom, 0.32 * element.brightness * 2, 1000); //element.brightness * starSize * zoom    //var size = starSize * zoom * 1.5 * (6-i)
			/* //Повороты
			translate(width/2, height/2);
			rotate(-(referenceBody.body.angle));
			translate(- width/2, -height/2);
			*/
			// circle(x, y, size); //выглядит некрасиво, но работает эффективно //zoom не работает рдлытос! //Сделать объекты на небе настоящими объектами
			circle(newX, newY, size);
		});
	}
	pop()
}