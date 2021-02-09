var bodies = [];
const c = 4; //3,6,12,300
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
var zoom = 1;
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

    updateWorld();
    drawWorld();

    currentFPS = (1000 / (thisLoop - lastLoop)).toFixed(0); //FPS на предыдушем кадре%)
    lastLoop = thisLoop;
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
    if(keyCode != 116 && keyCode != 123){ //116-f5, 123-f12, 
        return false;
    }
  };

  function mouseWheel(event){
    // let oldZoom = zoom;
    // zoom += event.delta / 1000;
    // console.log(event.delta, zoom);
    // if(zoom > maxZoom){zoom = maxZoom}
    // if(zoom < minZoom){zoom = minZoom}
    // if(oldZoom != zoom){
        
    // }

    dir = event.delta/Math.abs(event.delta);

    zoom = clamp(zoom + dir * zoomDelta, minZoom, maxZoom);
    

    // if(dir == 1 && zoom >= 1){
    //     zoom += 0.1;
    // }
    // if(dir == -1 && zoom > 1){
    //     zoom += -0.1;
    // }
    // if(dir == -1 && zoom >= 0 && zoom <= 1){
    //     zoom += - 0.1;
    // }
    // if(dir == 1 && zoom >= 0 && zoom <= 1){
    //     zoom += 0.1;
    // }
    // if(zoom <=0){
    //     zoom = 0.1;
    // }

    // if(dir >= 1){
    //     zoom += 1;
    // } else if(dir <= -1){
    //     if(zoom <=1 && zoom >=0){
    //         zoom -= 2**(zoom**(-1));
    //     }else{
    //         zoom += -1;
    //     }
    // } else if(zoom < 1 && zoom > 0){
    //     zoom -= 2**(zoom**(-1));
    // } else {
    //     zoom = 1;
    // }

    // console.log(dir + ", " + zoom);
    
    
    //zoom += dir * (1)**dir; //10 - это насколько быстро будет менятся зум
  }

// function relativeVelocity(VelOfTargetPoint, referencePointVel){
//     var resultX = (VelOfTargetPoint.x - referencePointVel.x) / (1 - (VelOfTargetPoint.x*referencePointVel.x) / (c**2));
//     var resultY = (VelOfTargetPoint.y - referencePointVel.y) / (1 - (VelOfTargetPoint.y*referencePointVel.y) / (c**2));
    
//     // var resultX = -1 * (c**2)*(VelOfTargetPoint.x-referencePointVel.x)/(VelOfTargetPoint.x*referencePointVel.x - 9);
//     // var resultY = -1 * (c**2)*(VelOfTargetPoint.y-referencePointVel.y)/(VelOfTargetPoint.y*referencePointVel.y - 9);

//     // console.log(resultX + " и " +  resultY);
//     // console.log((1 - (VelOfTargetPoint.mag()*referencePointVel.mag()) / (c**2)));

//     return createVector(resultX, resultY);
// }

function clamp(x, min, max){
    return Math.max(min, Math.min(x, max) );
}

function relativeVelocity(VelOfTargetPoint, referencePointVel){
    var resultX = (VelOfTargetPoint.x - referencePointVel.x) / (1 - (VelOfTargetPoint.x*referencePointVel.x) / (c**2));
    var resultY = (VelOfTargetPoint.y - referencePointVel.y) / (1 - (VelOfTargetPoint.y*referencePointVel.y) / (c**2));
    
    // var resultX = -1 * (c**2)*(VelOfTargetPoint.x-referencePointVel.x)/(VelOfTargetPoint.x*referencePointVel.x - 9);
    // var resultY = -1 * (c**2)*(VelOfTargetPoint.y-referencePointVel.y)/(VelOfTargetPoint.y*referencePointVel.y - 9);

    // console.log(resultX + " и " +  resultY);
    // console.log((1 - (VelOfTargetPoint.mag()*referencePointVel.mag()) / (c**2)));

    return createVector(resultX, resultY);
}