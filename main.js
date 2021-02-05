var bodies = [];
const c = 6; //3
var referenceObject;
var camOffset;
var keyboard = {
    rightArrPressed: false,
    leftArrPressed: false,
    upArrPressed: false,
    downArrPressed: false,
    spacePressed: false,
}
var SHOW_CURSOR = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    startWorld();
}

function draw() {
    background(0);
    push();
    strokeWeight(5);
    stroke(255);
    line(0 - camOffset.x,7000 - camOffset.y,0 - camOffset.x,-7000 + camOffset.y);
    line(-7000 - camOffset.x, 0 - camOffset.y, 7000 - camOffset.x, 0 - camOffset.y); //перенести в worldDraw()
    pop();
    updateWorld();
}

function keyReleased() {
    if (keyCode == RIGHT_ARROW) {
        keyboard.rightArrPressed = false;
    } else if (keyCode == LEFT_ARROW) {
        keyboard.leftArrPressed = false;
        // console.log("LEFT_RELEASED")
    }else if (keyCode == UP_ARROW) {
        keyboard.upArrPressed = false;
    } else if(key == " ") {
        keyboard.spacePressed = false;
    }
    return false;
};

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
    } else if (keyCode == 114){ //turn bounding 'F3'
        // SHOW_BOUNDING = !SHOW_BOUNDING;
        SHOW_CURSOR = !SHOW_CURSOR;
        // console.log(SHOW_BOUNDING);
        // console.log(SHOW_CURSOR);
    }
    if(SHOW_CURSOR == true){
        cursor(ARROW);
    } else {
        noCursor();
    }
    if(keyCode != 116){
        return false;
    }
  };

function relativeVelocity(VelOfTargetPoint, referencePointVel){
    var resultX = (VelOfTargetPoint.x - referencePointVel.x) / (1 - (VelOfTargetPoint.x*referencePointVel.x) / (c**2));
    var resultY = (VelOfTargetPoint.y - referencePointVel.y) / (1 - (VelOfTargetPoint.y*referencePointVel.y) / (c**2));
    
    // var resultX = -1 * (c**2)*(VelOfTargetPoint.x-referencePointVel.x)/(VelOfTargetPoint.x*referencePointVel.x - 9);
    // var resultY = -1 * (c**2)*(VelOfTargetPoint.y-referencePointVel.y)/(VelOfTargetPoint.y*referencePointVel.y - 9);

    // console.log(resultX + " и " +  resultY);
    // console.log((1 - (VelOfTargetPoint.mag()*referencePointVel.mag()) / (c**2)));

    return createVector(resultX, resultY);
}