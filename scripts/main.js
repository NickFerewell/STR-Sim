// const gameVersion = document.querySelector('meta[name="gameVersion"]').content;

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
//Добавить то, куда летать и то, где узнать как туда долететь. повысить оптимизацию. пофиксить lerp(делано, уменьшил и всё)

function setup(){
    gameCanvas = document.getElementById("defaultCanvas0");

    frameRate(screenMaxFPS);

    lastLoop = new Date();

    // console.log(DEBUG_MODE, localStorage.getItem("DEBUG_MODE"), !DEBUG_MODE);
    // DEBUG_MODE =  localStorage.getItem("DEBUG_MODE");
    // console.log(localStorage.getItem("DEBUG_MODE"))
    // turnDebugMode(false)
    // console.log(localStorage.getItem("DEBUG_MODE"), !localStorage.getItem("DEBUG_MODE"), !!localStorage.getItem("DEBUG_MODE"));
    // console.log(+(localStorage.getItem("DEBUG_MODE")), !(+localStorage.getItem("DEBUG_MODE")), !!(+localStorage.getItem("DEBUG_MODE")));
    // turnDebugMode(!!(+localStorage.getItem("DEBUG_MODE")));
    turnDebugMode(+localStorage.getItem("DEBUG_MODE"))
    // console.log(localStorage.getItem("DEBUG_MODE"), false)
    // DEBUG_MODE = false;
    // console.log(DEBUG_MODE, localStorage.getItem("DEBUG_MODE"))


    startWorld();
}

function draw(){ //main loop
    thisLoop = new Date(); //время в начале цикла в миллисекундах

    updateWorld();
    drawWorld();

    currentFPS = (1000 / (thisLoop - lastLoop)).toFixed(0); //FPS на предыдушем кадре%)
    lastLoop = thisLoop;
}

function mouseDragged(){
    switch (mouseButton) {
        case LEFT:
            // new Box(mouseX + camOffset.x, mouseY + camOffset.y, random(10, 40), random(10, 40), 0, -20);
            new Box((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, random(10, 40), random(10, 40), 0, -20);
            break;
        case RIGHT:
            // new Circle(mouseX + camOffset.x, mouseY + camOffset.y, random(10, 40));
            // new Circle((mouseX + referenceBody.body.position.x - width/2) / zoom, (mouseY + referenceBody.body.position.y - height/2)/zoom, random(10, 40))
            // new Circle((mouseX - width/2 + referenceBody.body.position.x) * (zoom-1) + (mouseX) / zoom, 200, 6)
            // new Circle((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, random(10, 40));
            // new Rover(mouseX + camOffset.x, mouseY + camOffset.y, 100, 20, 16); //не работет рисование, обновить и абстрагировать
            // camOffset = {x: referenceBody.body.position.x - width/2
            new AnimationBody((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, newGeometries.animTestBox);
            // new AnimationBody((mouseX - width/2)/zoom + referenceBody.body.position.x, (mouseY - height/2)/zoom + referenceBody.body.position.y, newGeometries.testObject1);
            break;
    }
    
    false;
}

// function keyPressed(){
//     if(keyCode == 79){ //83-s,62, 79-o
//         new StellarBody(mouseX + camOffset.x, mouseY + camOffset.y, random(10, 40)* 6);
//     }
    
//     false;
// }



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
    // console.log(value);
    // if(value){
    //     DEBUG_MODE = value;
    //     SHOW_CURSOR = value;
    //     localStorage.setItem("DEBUG_MODE", value);
    // } else {
    //     DEBUG_MODE = localStorage.getItem("DEBUG_MODE");
    //     SHOW_CURSOR = localStorage.getItem("DEBUG_MODE");
    // }
    // DEBUG_MODE = value;
    // SHOW_CURSOR = value;
    // localStorage.setItem("DEBUG_MODE", value);
    // if(value == true){
    //     DEBUG_MODE = value;
    //     SHOW_CURSOR = value;
    //     localStorage.setItem("DEBUG_MODE", value);
    // } else if(value == false){
    //     DEBUG_MODE = value;
    //     SHOW_CURSOR = value;
    //     localStorage.setItem("DEBUG_MODE", value);
    // } else {
    //     var setting = localStorage.getItem("DEBUG_MODE");
    //     if(setting != null || setting != undefined){
    //         DEBUG_MODE = setting;
    //     } else{
    //         DEBUG_MODE = false;
    //         localStorage.setItem("DEBUG_MODE", false);
    //     }
    // }
    DEBUG_MODE = value;
    turnCursor(value);
    localStorage.setItem("DEBUG_MODE", value);
}

function turnCursor(value){
    // console.log("CURSOR: " + value)
    // cursor(ARROW);
    // SHOW_CURSOR = value;
    // if(value == true){
    //     // console.log(SHOW_CURSOR, value);
    //     cursor(ARROW);
    //     console.log(ARROW)
    // } else if(value == 0){
    //     // console.log(SHOW_CURSOR, value)
    //     // console.log("hsg")
    //     noCursor();
    // }
    SHOW_CURSOR = value;
    if(SHOW_CURSOR == true){
        cursor(ARROW);
    } else {
        noCursor();
    }
}

