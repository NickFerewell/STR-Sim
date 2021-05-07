
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
	// box.style.display = "block";
	box.style["pointer-events"] = "all";
	box.style.opacity = "0.9";
	pauseGame();
}
function closeDialog(){
	var box = document.getElementById("dialogBox");
	box.style["pointer-events"] = "none";
	box.style.opacity = "0";
	unpauseGame();
}
