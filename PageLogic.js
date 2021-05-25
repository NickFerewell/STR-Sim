
function moveP5CanvasToContent(){
	document.getElementById("content").appendChild(document.getElementById("defaultCanvas0"));
}

function turnOnOffSliderButton(){ //open menu button
	var opacity = document.getElementById("slide").style.opacity;
	// if(opacity <1){
	// 	document.getElementById("slide").style.opacity = "1";
	// } else {
	// 	document.getElementById("slide").style.opacity = "0";
	// }
	if(opacity == "" || opacity == 1){
		document.getElementById("slide").style.opacity = "0";
	} else {
		document.getElementById("slide").style.opacity = "1";
	}
}

//Side-menu logic
function openSlideMenu(){
	document.getElementById('menu').style.width = '30%';
	// document.getElementById('content').style.marginLeft = '30%'; //250px
	document.getElementById("slide").style.opacity = "0";
	pauseGame();
}
function closeSlideMenu(){
    document.getElementById('menu').style.width = '0';
    // document.getElementById('content').style.marginLeft = '0';
    document.getElementById("slide").style.opacity = "1";
    unpauseGame();
}

function turnSlideMenu(){
	var width = document.getElementById('menu').style.width;
	console.log(width)
	if(width == "0px" || width == "0" || width == ""){
		openSlideMenu();
	} else {
		closeSlideMenu();
	}
	console.log("hfh")
}

document.gameVersion = document.querySelector('meta[name="gameVersion"]').content;

window.addEventListener('contextmenu', function(e){
	e.preventDefault();
}, false);

//Скриншот на F1
function saveScreenshot(){
	console.log("processing screenshot");
	var dataURL = gameCanvas.toDataURL("image/png"); //image/jpeg
	var link = document.createElement("a");
	document.body.appendChild(link); // Firefox requires the link to be in the body :(
	link.href = dataURL;
	link.download = "screenshot.png"; //.jpg
	link.click();
	document.body.removeChild(link);
}

function displayDialog(speechID = 0){ //dialogID
	var box = document.getElementById("dialogBox");
	var title = document.getElementById("dialogTitle");
	var text = document.getElementById("dialogText");
	var name = document.getElementById("dialogName");
	var speech = speeches[speechID];
	name.textContent = speech.name;
	text.textContent = speech.text;
	title.textContent = speech.title;
	// box.style.display = "block";
	box.style["pointer-events"] = "all";
	box.style.opacity = "0.9";
	pauseGame();

	const s = ( sketch ) => {

		let x = 100;
		let y = 100;
		let previewElement = document.getElementById("dialogPreview");

		sketch.setup = () => {
			sketch.createCanvas(previewElement.clientWidth, previewElement.clientHeight);
			previewElement.appendChild(document.getElementById("defaultCanvas1"));
			// sketch.createCanvas(1000, 1000)
			// sketch.background(0);

			//draw model to preview
			// var tempGeometry = newGeometries[speech.preview];
			console.log(newGeometries[speech.preview]);
			var geometry = _.merge(_.cloneDeep(newGeometries[speech.preview]), newGeometries.standartGeometry);
			for(var i = 0; i < geometry.shapes.length; i++){
				console.log(geometry.shapes[i], newGeometries[speech.preview].shapes[i])
				geometry.shapes[i] = _.merge(_.cloneDeep(newGeometries.standartGeometry.shapes[0]), newGeometries[speech.preview].shapes[i]);
			};

			console.log(geometry)

			let figureOffset = {x: previewElement.clientWidth / 2, y: previewElement.clientHeight / 2};

			let randomAngle = (Math.random() * 2 - 1) * PI/2;
			let randomOffset = Math.random() * 20; //Максимальный сдвиг 20 пикселей

			for(i = 0; i < geometry.shapes.length; i++){
				sketch.push();
				const figure = geometry.shapes[i];
				// console.log(figure)
				// console.log(figure.isRendering)
				if(figure.isRendering){
					// sketch.translate(geometry.position.x * geometry.scale.x + randomOffset + figureOffset.x + figure.position.x*geometry.scale.x, geometry.position.y * geometry.scale.y + randomOffset + figureOffset.y + figure.position.y*geometry.scale.y);
					
					sketch.translate(figureOffset.x + randomOffset, figureOffset.y + randomOffset); //Это неправильно, но почему то работает. Надо сначала translate, потом rotate и scale

					sketch.rotate(figure.angle + randomAngle);
					sketch.translate(geometry.position.x * geometry.scale.x + figure.position.x, geometry.position.y * geometry.scale.y + figure.position.y);

					sketch.scale(figure.scale.x, figure.scale.y);
					// scale(element.width / getBBox(geometry.shapes).width); //Чтобы фигура не вылезала за края

					if(figure.fill){
						sketch.fill(figure.color);
					} else {
						sketch.noFill();
					}
					sketch.stroke(figure.outline);
					sketch.strokeWeight(figure.stroke);
					// if(figure.isStrokeScaling == true){
					// 	scale(this.scale.x, this.scale.y)
					// 	scale(figureToRender.scale.x, figureToRender.scale.y);
					// }

					switch (figure.type) {
						case "circle":
						sketch.ellipseMode(RADIUS);
							sketch.circle(0, 0, figure.r);
							break;

						case "concave line":
							sketch.beginShape();
							if(!figure.isStrokeScaling){
								for(var i = 0; i < figure.vertexes.length; i++){
									const vert = figure.vertexes[i];
									// vertex((vert.x - referenceBody.body.position.x) * this.scale.x * figureToRender.scale.x + width/2, (vert.y - referenceBody.body.position.y)* this.scale.y * figureToRender.scale.y + height/2);
								};
							} else {
								figure.vertexes.forEach( function(vert) {
									sketch.vertex(vert.x, vert.y);
								});
							}
							sketch.endShape(CLOSE);
							break;

						default:
							sketch.textAlign(CENTER);
							sketch.text("there is no geometry", 0, 0)
							break;
					}
					// sketch.stroke(255, 255, 0);
					// sketch.strokeWeight(6);
					// sketch.point(0, 0);
				}
				sketch.pop();
			}

		};

		sketch.draw = () => {
			// sketch.background(0);
			// sketch.fill(255);
		};
		sketch.keyPressed = () =>{
			if(keyCode != 116){
				return false;
			}
		}

		sketch.keyReleased = () =>{
			// if(keyCode != 116){
				return false;
			// }
		}
	};

	let myp5 = new p5(s);
	
}
displayDialog();
function closeDialog(){
	var box = document.getElementById("dialogBox");
	box.style["pointer-events"] = "none";
	box.style.opacity = "0";
	unpauseGame();
}

/*
var speedometer = {
	elementStyle: document.getElementById("speedometer").style,
	angularSpeed: 3,
	currentAngle: 0,
	targetAngle: 90,
	moveArrow: function(toAngle){
		this.targetAngle = toAngle;
	},
	update: function(){
		// this.currentAngle += (this.targetAngle - this.currentAngle) * this.angularSpeed;
		this.elementStyle.transform = "translate(0%, 50%) rotate(" + (this.targetAngle - Math.PI/2) + "rad) scale(0.6)"
		// console.log(this.currentAngle)
	}
}
*/