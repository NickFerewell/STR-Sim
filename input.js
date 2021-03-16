//input and controls

//camera
var camOffset;
var prevCamOffset;
var camSpeed = 0.65; //0.75

var keyboard = { //Сделать словарём булов для оптимизации(?). Сделать это словарём кейкодов, и сделать функцию для получения булевого значения, для этого нужен ещё один словарь с соотнесением кодов и клавиш. Ну или можно оставить и так. И так хорошо.
    rightArrPressed: false, //Сделать систему инпутов как в Unity
    leftArrPressed: false,  //Переделать и организовать через event.key
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
    controlPressed: false
};

var SHOW_CURSOR = true;
var DEBUG_MODE = true;
var IS_PAUSED = false;
var FPS = 60;
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
        SHOW_CURSOR = !SHOW_CURSOR;
        DEBUG_MODE = !DEBUG_MODE;
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