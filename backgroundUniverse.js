var backgroundUniverse = []; //массив слоёв паралакса заднего фона
var layersNum = 4;
var backUniverseSize = 5; //5, 1/minZoom?
var starSize = 2; //1, 1.5, 8, 2
var starCount = backUniverseSize * 16 * 2 * 1.5;//с двойкой лучше и красивее //количество звёзд на самом заднем уровне 20, 40. 400 для 5 размера вселенной. backUniverseSize * 80, backUniverseSize * 16
var parallaxSpeed = 0.1; //0.9, 0.3
var backUniverseSizeW;
var backUniverseSizeH;

function generateBackgroundUniverse(){
	backUniverseSizeW = canvWidth * backUniverseSize; //width * 1/minZoom?
	backUniverseSizeH = canvHeight * backUniverseSize; //height * 1/minZoom

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
	
	push();
	for (var i = 0; i < backgroundUniverse.length; i++) {

		backgroundUniverse[i].forEach( function(element, index) { 
			colorMode(HSB); //HSV, value, lightness
			fill(100 * element.brightness,40,30 * element.brightness); //сделать звёзды чуть темнее
			var parLayerSpeed = parallaxSpeed / (i + 1 + element.parLayerShift);

			var starSpeed = relativeVelocity(referenceObject.vel.copy().mult(parLayerSpeed), referenceObject.vel); //Можно преобразовать
			var starGamma = {x: 1, y: 1};
			// starGamma.x = 1 / Math.sqrt(1 - (starSpeed.x**2)/(c**2));
			starGamma.x = Math.min(1 / Math.sqrt(1 - (starSpeed.x / c)**2), maxGamma);
			starGamma.y = Math.min(1 / Math.sqrt(1 - (starSpeed.y / c)**2), maxGamma);


			var x = ((-(referenceObject.pos.x))*parLayerSpeed + element.x - (Math.sign(referenceObject.pos.x))*(backUniverseSizeW/2))% (backUniverseSizeW) + (backUniverseSizeW/2) + (Math.sign(referenceObject.pos.x))*(backUniverseSizeW/2)
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

			var y = ((-(referenceObject.pos.y))*parLayerSpeed + element.y - (Math.sign(referenceObject.pos.y))*(backUniverseSizeH/2))% (backUniverseSizeH) + (backUniverseSizeH/2) + (Math.sign(referenceObject.pos.y))*(backUniverseSizeH/2)
			y -= (height/2 - y) * zoom;
			if(y > height/2){
				y = y / starGamma.y;
			} else{
				y = y * starGamma.y;
			}

			var size = clamp(element.brightness * starSize * zoom, 0.32 * element.brightness * 2, 1000); //element.brightness * starSize * zoom    //var size = starSize * zoom * 1.5 * (6-i)
			circle(x, y, size); //выглядит некрасиво, но работает эффективно //zoom не работает рдлытос! //Сделать объекты на небе настоящими объектами
		});
	}
	pop()
}