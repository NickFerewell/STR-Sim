// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var bodies = [];
var stellarBodies = [];
var engine;
var world;

var gameCanvas;

var referenceBody;
var G = 0.05; //0.05, 1
var c = 12; //12, 30, 2, 4, 120, 60, 9
var c2 = c ** 2;

var maxGamma = 280; //10, 280, 2
var renderMode = 2;
const RENDER_MODE_NUM = 3;

function setup(){
    gameCanvas = document.getElementById("defaultCanvas0");

    frameRate(screenMaxFPS);

    lastLoop = new Date();

    turnDebugMode(+localStorage.getItem("DEBUG_MODE"))

    startWorld();
}

function draw(){ //main loop
    thisLoop = new Date(); //время в начале цикла в миллисекундах

    updateWorld();
    drawWorld();

    currentFPS = (1000 / (thisLoop - lastLoop)).toFixed(0); //FPS на предыдушем кадре
    lastLoop = thisLoop;
}

function mouseDragged(){
    switch (mouseButton) {
        case LEFT:
            new Box((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, random(10, 40), random(10, 40), 0, 0);
            break;
        case RIGHT:
            new AnimationBody((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, newGeometries.animTestBox);
            break;
    }
    
    false;
}

function turnDebugMode(value){
    DEBUG_MODE = value;
    turnCursor(value);
    localStorage.setItem("DEBUG_MODE", value);
}

function turnCursor(value){
    SHOW_CURSOR = value;
    if(SHOW_CURSOR == true){
        cursor(ARROW);
    } else {
        noCursor();
    }
}





