//input and controls

//camera
var camOffset;
var prevCamOffset;
var camSpeed = 1; //0.75, 0.65

var mouseWorldPosition = {x: 0, y: 0};

var keyboard = { 
    rightArrPressed: false,
    leftArrPressed: false,
    upArrPressed: false,
    downArrPressed: false,
    spacePressed: false,
    shiftPressed: false,
    W: false,
    A: false,
    S: false,
    D: false,
    Minus: false,
    Plus: false,
    O: false,
    BackSlash: false,
    P: false,
    controlPressed: false,
    F1: false,
    c: false,
    F2: false,
};

var SHOW_CURSOR;
var DRAW_GUI = true;
var DEBUG_MODE;
// var IS_PAUSED = false;
var zoom = 1; //0.5, 1, 0.425
var screenMaxFPS = 60;
var currentFPS;
var lastLoop; //время в миллисекундах на последнем кадре
var thisLoop; //время в миллисекундах на этом кадре
var canvWidth;
var canvHeight;
var zoomDelta = 0.01;
var minZoom = 0.2; //дальше звёзды на фоне пропадают
var maxZoom = 5; // maxZoom = 1/minZoom


// function updateInput(){
//     prevKeyboard = keyboard;
// }

// function myKeyPressed(key){
//     if(prevKeyboard[key] == false && keyboard[key] == true){
//         return true;
//     } else false
//     //return !prevKeyboard[key] * keyboard[key]
// }

function keyReleased() {
    if(key == " ") {
        keyboard.spacePressed = false;
    } else if (keyCode == RIGHT_ARROW) {
        keyboard.rightArrPressed = false;
    } else if (keyCode == LEFT_ARROW) {
        keyboard.leftArrPressed = false;
    }else if (keyCode == UP_ARROW) {
        keyboard.upArrPressed = false;
    } else if (keyCode == DOWN_ARROW) {
        keyboard.downArrPressed = false;
    } else if (keyCode == SHIFT) {
        keyboard.shiftPressed = false;
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
    } else if (keyCode == 80){ //P - pause the game(updateWorld)
        keyboard.P = false;
    } else if (keyCode == 9){ //TAB - renderMode
        keyboard.TAB = false;
    } else if(keyCode == 79){ //O - new StellarObject
    	keyboard.O = false;
    } else if(keyCode == 220){ // \ - change renderMode
        keyboard.BackSlash = false;
    } else if(keyCode == 17){ // ctrl - маневровые двигатели
        keyboard.controlPressed = false;
    } else if(keyCode == 112){ // F1 - делает скриншот
        keyboard.F1 = false;
    } else if(keyCode == 113){ // F2 - вкл./выкл. интерфейс
        keyboard.F2 = false;
    } else if(keyCode == 67){ // C - мгновенно переворачивает корабль
        keyboard.c = false;
    }
    return false;
}

function keyPressed() {
    if(key == " "){
        keyboard.spacePressed = true;
    } else if (keyCode == RIGHT_ARROW) {
        keyboard.rightArrPressed = true;
    } else if (keyCode == LEFT_ARROW) {
        keyboard.leftArrPressed = true;
    } else if (keyCode == UP_ARROW) {
        keyboard.upArrPressed = true;
    } else if (keyCode == DOWN_ARROW) {
        keyboard.downArrPressed = true;
    } else if (keyCode == SHIFT) {
        keyboard.shiftPressed = true;
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
        turnDebugMode(+!DEBUG_MODE);
    } else if (keyCode == 9){ //TAB
        keyboard.TAB = true;
    } else if(keyCode == 79){ //O - new StellarObject
    	keyboard.O = true;
    } else if(keyCode == 220){ // \ - change renderMode
        keyboard.BackSlash = true;
        renderMode = (renderMode + 1) % RENDER_MODE_NUM;
    } else if (keyCode == 80){ //P - pause the game(updateWorld)
        keyboard.P = true;
        isPaused = !isPaused;
    } else if(keyCode == 17){ // ctrl - маневровые двигатели
        keyboard.controlPressed = true;
    } else if(keyCode == 112){ // F1 - делает скриншот
        keyboard.F1 = true;
        saveScreenshot();
    } else if(keyCode == 113){ // F2 - вкл./выкл. интерфейс
        keyboard.F2 = true;
        DRAW_GUI = !DRAW_GUI;
        turnOnOffSliderButton();
    } else if(keyCode == 67){ // C - мгновенно переворачивает корабль
        keyboard.c = true;
        Matter.Body.setAngle(referenceBody.body, referenceBody.body.angle + Math.PI);
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

function mousePressed(){
    mouseWorldPosition = {x: (mouseX - width/2)/zoom + referenceBody.body.position.x, y: (mouseY - height/2)/zoom + referenceBody.body.position.y};
}