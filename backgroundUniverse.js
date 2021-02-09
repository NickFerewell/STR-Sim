// class BackgroundUniverse{
// 	static unit = 10;
// 	static nSectorsX = canvWidth / this.unit;
// 	static nSectorsY = canvHeight / this.unit;
// 	static draw(){
// 		var screenSector = {x:0,y:0};
// 		for(screenSector.x = 0; screenSector.x < this.nSectorsX; screenSector.x++){ //x
// 			for (screenSector.y = 0; screenSector.y < nSectorsY; screenSector.y++) { //y
// 				randomSeed(y);
// 				rnd = random(20)
// 				if(rnd <= 1){
// 					stroke(255 / rnd);
// 					point(screenSector.x * unit + unit/2, screenSector.y * unit + unit/2, rnd);
// 				}
// 			}
// 		}
// 	}
// }

// function drawBackgroundUniverse(){
// 	var unit = 10;
// 	var nSectorsX = canvWidth / this.unit;
// 	var nSectorsY = canvHeight / this.unit;
	
// 	// var screenSector = {x:0,y:0};
// 	var screenSectorX;

// 	for(this.screenSectorX = 0; this.screenSectorX < this.nSectorsX; this.screenSectorX++){ //x
// 		for (this.screenSector.y = 0; this.screenSector.y < this.nSectorsY; this.screenSector.y++) { //y
// 			randomSeed(y);
// 			var rnd = random(20)
// 			if(this.rnd <= 1){
// 				stroke(255 / this.rnd);
// 				point(this.screenSector.x * this.unit + this.unit/2, this.screenSector.y * this.unit + this.unit/2, this.rnd);
// 			}
// 		}
// 	}
// }
var backgroundUniverse = []; //массив слоёв паралакса заднего фона
var starSize = 1.5; //1, 8
var parallaxSpeed = 0.3;
var backUniverseSize = 5;
var backUniverseSizeW;
var backUniverseSizeH;

function generateBackgroundUniverse(){
	backUniverseSizeW = canvWidth * backUniverseSize; //width * 1/minZoom?
	backUniverseSizeH = canvHeight * backUniverseSize;

	var layersNum = 4;
	var starCount = 400; //количество звёзд на самом заднем уровне 20, 40
	for (var i = 0; i < layersNum; i++) {
		backgroundUniverse.push([]);
		for (var j = 0; j < starCount; j++) {
			var newStar = {x: random(- width * 1/minZoom, width * 1/minZoom), y: random(-height * 1/minZoom, height * 1/minZoom), brightness: (layersNum - i) * random(0.5, 1.5),}
			backgroundUniverse[i].push(newStar);
		}
	}
}

function drawBackgroundUniverse(){ //ЛАГАЕТ!(((
	// var noiseScale = 2; //0.02
	// var unit = 100;
	// var nSectorsX = canvWidth / unit;
	// var nSectorsY = canvHeight / unit;
	// console.log(nSectorsX, nSectorsY);
	
	// // var screenSector = {x:0,y:0};
	// for(x = 0; x < nSectorsX; x++){ //x
	// 	for (y = 0; y < nSectorsY; y ++) { //y
	// 		// console.log("Yeet!");
	// 		// randomSeed(y);
	// 		var value = noise((x + camOffset.x) * noiseScale,(y + camOffset.y) * noiseScale);
	// 		console.log(value);
	// 		if(value < 0.5){
	// 			stroke(255 * value, 100, 100);
	// 			circle((x+camOffset.x) * unit, (y+camOffset.y)*unit, value*10);
	// 			console.log(x,y);
	// 		}
	// 	}
	// }
	push();
	for (var i = 0; i < backgroundUniverse.length; i++) {
		// var layerDifX = referenceObject.pos.x * parallaxSpeed/(i+1);
		// layerDifX = layerDifX % width;
		// console.log(layerDifX);

		// var layerDifY = referenceObject.pos.Y * parallaxSpeed/i;
		// layerDifY = layerDifY % width;

		// translate(layerDifX, layerDifY);

		backgroundUniverse[i].forEach( function(element, index) {
			colorMode(HSB); //HSV, value, lightness
			fill(100 * element.brightness,40,30 * element.brightness); //сделать звёзды чуть темнее
			var parLayerSpeed = parallaxSpeed / (i + 1);

			var x = ((parLayerSpeed * (element.x - referenceObject.pos.x)) % (backUniverseSizeW));// % width * 2.5 означает, что когда звёзды закончатся, то они начнут повторятся. Они создаются на промежутке -width/2.5, как сказано в generateBackgroundUnivesre
			
			// console.log(backUniverseSizeW)
			var y = ((element.y * zoom) % (height*2.5) + height/2) - (referenceObject.pos.y * parLayerSpeed);

			// var x = (element.x * zoom - referenceObject.pos.x) * 0.1;
			// x = x % width;
			// var y = (element.y * zoom - referenceObject.pos.y) * 0.1;
			// y = y % height;

			var size = element.brightness * starSize * zoom;
			circle(x, y, size); //выглядит некрасиво, но работает эффективно //zoom не работает рдлытос!
		});
	}
	pop()
}

// var x = ((element.x * zoom) % (width * 2.5) + width/2) - (referenceObject.pos.x * parallaxSpeed/(i+1));
// var x = ((referenceObject.pos.x + element.x) * parLayerSpeed) % width * 2.5