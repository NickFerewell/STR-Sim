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

    // moveP5CanvasToContent()
}

function draw(){ //main loop
    thisLoop = new Date(); //время в начале цикла в миллисекундах

    updateWorld();
    drawWorld();

    if(DRAW_GUI) drawGUI();

    currentFPS = (1000 / (thisLoop - lastLoop)).toFixed(0); //FPS на предыдушем кадре
    lastLoop = thisLoop;
}

function mouseDragged(){
    switch (mouseButton) {
        case LEFT:
            new Box((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, random(10, 40), random(10, 40), 0, 0);
            break;
        case RIGHT:
            new AnimationBody((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, newGeometries.testObject1);
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

function drawGUI(){
    // text("Rapidity: " + Math.atanh(myMagnitude(referenceBody.body.velocity)/rmath.c), 0, height - 60);
    // text("Logarithmic rapidity: " + Math.log(myMagnitude(referenceBody.body.velocity) + 1), 0, height - 70);
    // text("Rapidity: " + myMagnitude(referenceBody.body.velocity)**2, width - 20, height - 80); //Quadratic rapidity

    //Speedometer
    push();
    translate(width - 20, height - 20);
    scale(1.5);
    rect(-63, -133, 60, 18);
    textAlign(RIGHT);
    text("Быстрота", -6, -120); //Quadratic rapidity, быстрота, спидометр, скорость
    // arc(0, 0, 220, 220, -PI, -PI/2);
    arc(20, 20, 270, 270, -PI, -PI/2);
    // textAlign(LEFT);
    // text("0", -108, -2);
    textAlign(CENTER, TOP);
    text("0", -108, -2);
    text("0,5c", - 90, -40);
    text("0,7c", - 70, -70);
    text("0,85c", -35, -95);
    // textAlign(RIGHT, TOP);
    text("c", -2, -108);
    rotate(map(myMagnitude(referenceBody.body.velocity)**2, 0, rmath.c**2, 0, Math.PI/2) + Math.PI);
    strokeWeight(2);
    // strokeCap(ROUND);
    strokeJoin(ROUND);
    beginShape();
    vertex(-10, -10);
    vertex(100, 0);
    vertex(-10, 10)
    endShape(CLOSE);
    pop();
}





