var bodies = [];
var referenceObject;
var camOffset;
var keyboard = { //Сделать словарём булов для оптимизации(?). Сделать это словарём кейкодов, и сделать функцию для получения булевого значения, для этого нужен ещё один словарь с соотнесением кодов и клавиш. Ну или можно оставить и так. И так хорошо.
    rightArrPressed: false, //Сделать систему инпутов как в Unity
    leftArrPressed: false,  //Переделать и организовать через event.key
    upArrPressed: false,
    downArrPressed: false,
    spacePressed: false,
    W: false,
    A: false,
    S: false,
    D: false,
    Minus: false,
    Plus: false
};

var SHOW_CURSOR = true;
var SHOW_BOUNDING = true;
var IS_PAUSED = false;
var FPS = 60;
var zoom = 0.5; //0.5, 1
var G = 5; //0.006, 10, 5
var c = 12;
var maxGamma = 10;
var lengthContractionMode = 1;
var screenMaxFPS = 60;
var currentFPS;
var lastLoop; //время в миллисекундах на последнем кадре
var thisLoop; //время в миллисекундах на этом кадре
var canvWidth;
var canvHeight;
var zoomDelta = 0.01;
var minZoom = 0.2; //дальше звёзды на фоне пропадают
var maxZoom = 5; // maxZoom = 1/minZoom

function setup() {
    canvWidth = windowWidth;
    canvHeight = windowHeight;
    createCanvas(canvWidth, canvHeight);
    frameRate(screenMaxFPS);

    lastLoop = new Date(); 

    startWorld();
}

function draw() {
    thisLoop = new Date(); //время в начале цикла в миллисекундах

    if(!IS_PAUSED){
        updateWorld();
    }
    drawWorld();

    currentFPS = (1000 / (thisLoop - lastLoop)).toFixed(0); //FPS на предыдушем кадре
    lastLoop = thisLoop;
}

function keyReleased() {
    if(key == " ") {
        keyboard.spacePressed = false;
    } else if (keyCode == RIGHT_ARROW) {
        keyboard.rightArrPressed = false;
    } else if (keyCode == LEFT_ARROW) {
        keyboard.leftArrPressed = false;
        // console.log("LEFT_RELEASED")
    }else if (keyCode == UP_ARROW) {
        keyboard.upArrPressed = false;
    } else if (keyCode == DOWN_ARROW) {
        keyboard.downArrPressed = false;
    } else if (keyCode == 87) { //W
        keyboard.W = false;
    } else if (keyCode == 65) { //A
        keyboard.A = false;
    } else if (keyCode == 83) { //S
        keyboard.S = false;
    } else if (keyCode == 68) { //D
        keyboard.D = false;
    } else if (keyCode == 187 || keyCode == 107) { //+ || numpad+
        keyboard.Plus = false;
    } else if (keyCode == 189 || keyCode == 109) { //- || numpad-
        keyboard.Minus = false;
    }else if (keyCode == 80){ //P - pause the game(updateWorld)
        keyboard.P = false;
    } else if (keyCode == 9){ //TAB - lengthContractionMode
        keyboard.TAB = false;
    }
    return false;
}

function keyPressed() {
    if(key == " "){
        keyboard.spacePressed = true;
    } else if (keyCode == RIGHT_ARROW) {
        keyboard.rightArrPressed = true;
        // console.log("RIGHT_PRESSED")
    } else if (keyCode == LEFT_ARROW) {
        keyboard.leftArrPressed = true;
        // console.log("TURNINGLEFT")
    } else if (keyCode == UP_ARROW) {
        keyboard.upArrPressed = true;
    } else if (keyCode == DOWN_ARROW) {
        keyboard.downArrPressed = true;
    } else if (keyCode == 87) { //W
        keyboard.W = true;
    } else if (keyCode == 65) { //A
        keyboard.A = true;
    } else if (keyCode == 83) { //S
        keyboard.S = true;
    } else if (keyCode == 68) { //D
        keyboard.D = true;
    } else if (keyCode == 187 || keyCode == 107) { //+ || numpad+
        keyboard.Plus = true;
    } else if (keyCode == 189 || keyCode == 109) { //- || numpad-
        keyboard.Minus = true;
    } else if (keyCode == 114){ //turn bounding 'F3'
        SHOW_CURSOR = !SHOW_CURSOR;
        SHOW_BOUNDING = !SHOW_BOUNDING;
    } else if (keyCode == 80){ //P - pause the game(updateWorld)
        keyboard.P = true;
        IS_PAUSED = !IS_PAUSED;
    } else if (keyCode == 9){ //TAB - lengthContractionMode
        keyboard.TAB = true;
        lengthContractionMode = !lengthContractionMode;
    }
    if(SHOW_CURSOR === true){
        cursor(ARROW);
    } else {
        noCursor();
    }
    if(keyCode != 116 && keyCode != 123){ //116-f5, 123-f12, 
        return false;
    }
  }

  function mouseWheel(event){
    dir = event.delta/Math.abs(event.delta);
    changeZoom(dir);

    return false;
  }


function changeZoom(dir, mult = 1){
    zoom = clamp(zoom + dir * zoomDelta * mult, minZoom, maxZoom);
}

function clamp(x, min, max){
    return Math.max(min, Math.min(x, max) );
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function relativeVelocity(VelOfTargetPoint, referencePointVel){
    var resultX = (VelOfTargetPoint.x - referencePointVel.x) / (1 - (VelOfTargetPoint.x*referencePointVel.x) / (c**2));
    var resultY = (VelOfTargetPoint.y - referencePointVel.y) / (1 - (VelOfTargetPoint.y*referencePointVel.y) / (c**2));

    return createVector(resultX, resultY);
}