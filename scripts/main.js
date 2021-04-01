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

function relativeVelocity(VelOfTargetPoint, referencePointVel){
    // var resultX = (VelOfTargetPoint.x - referencePointVel.x) / (1 - (VelOfTargetPoint.x*referencePointVel.x) / (c**2));
    // var resultY = (VelOfTargetPoint.y - referencePointVel.y) / (1 - (VelOfTargetPoint.y*referencePointVel.y) / (c**2));

    // return {x: resultX, y: resultY};

    return myDiv(mySub(VelOfTargetPoint, referencePointVel), (1 - (myMagnitude(VelOfTargetPoint)*myMagnitude(referencePointVel))/(c**2)))
}

function relativeVelocity2(VelOfTargetPoint, referencePointVel, gammaOfTarget){ //Скорость объекта, который мы измеряем, относительно центра координат и скорость наблюдателя относительно центра координат. И лоренц-фактор объекта относительно центра координат
    // return myMult(myAdd(mySub(referencePointVel, VelOfTargetPoint), myMult(myMult(VelOfTargetPoint, gammaOfTarget - 1), myScalarMult(VelOfTargetPoint, referencePointVel)/(myMagnitude(VelOfTargetPoint)**2)-1)), 1/(gammaOfTarget*(1-myScalarMult(VelOfTargetPoint, referencePointVel)/(c**2))));
    // return myDiv(myAdd(mySub(VelOfTargetPoint, referencePointVel), (gammaOfTarget - 1)*myDiv(referencePointVel, myMagnitude(referencePointVel)**2)*(myScalarMult(referencePointVel, VelOfTargetPoint) - myMagnitude(referencePointVel)**2)), gammaOfTarget*(1-myScalarMult(referencePointVel, VelOfTargetPoint)/c**2));
    return myDiv(myAdd(mySub(VelOfTargetPoint, referencePointVel), myMult(myDiv(referencePointVel, myMagnitude(referencePointVel)**2), (gammaOfTarget - 1) * (myScalarMult(referencePointVel, VelOfTargetPoint) - myMagnitude(referencePointVel)**2))), gammaOfTarget*(1-myScalarMult(referencePointVel, VelOfTargetPoint)/c**2));

}

function relativeSpeed(VelOfTargetPoint, referencePointVel){
    // return Math.sqrt(1-(c**2- myMagnitude(VelOfTargetPoint)**2)*(c**2- myMagnitude(referencePointVel)**2)/((c**2- myScalarMult(VelOfTargetPoint, referencePointVel))**2))*c
    return Math.sqrt((mySqrOfVec3(mySub(VelOfTargetPoint, referencePointVel)) - 1/(c**2) * myCrossProduct(VelOfTargetPoint, referencePointVel)**2), (1 - myScalarMult(referencePointVel, VelOfTargetPoint)/(c**2)))
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

