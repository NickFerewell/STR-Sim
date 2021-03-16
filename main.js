// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var bodies = [];
var stellarBodies = [];
var engine;
var world;

var referenceBody;
var G = 0.05; //0.05, 1
var c = 12; //12, 30, 2, 4
var maxGamma = 10;
var renderMode = 2;
const RENDER_MODE_NUM = 3;

function setup(){
    frameRate(screenMaxFPS);

    lastLoop = new Date();

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

function myDist(from, to){
    // var x = to.x - from.x;
    // var y = to.y - from.y;
    // var dist = Math.sqrt(x**2 + y**2);
    // return dist;
    return Math.sqrt((to.x - from.x)**2 + (to.y - from.y)**2);
}
function mySub(from, what){
    return {x: what.x - from.x, y: what.y - from.y};
}
function myMult(what, times){
    return {x: what.x * times, y: what.y * times};
}
function myMagnitude(vec){
    return Math.sqrt(vec.x**2 + vec.y**2);
}
function myDiv(vec, times){
    return {x: vec.x / times, y: vec.y / times};
}
function myDiv2(vec, times){
    return myChangeMag(vec, myMagnitude(vec)/times);
}
function myChangeMag(vec, newMag){
    return myMult(vec, newMag/myMagnitude(vec));
}
function myChangeMagByRot(vec, newMag){
    var angle = Math.atan2(vec.y, vec.x); //arctg2
    return {x: newMag * cos(angle), y: newMag * sin(angle)};
}
function myNormalize(vec){
    var mag = myMagnitude(vec);
    if(mag != 0){
        return myDiv(vec, myMagnitude(vec));
    } else return {x: 1, y: 1};
}

function myHeading(vec){
    return Math.atan2(vec.y, vec.x);
}

function myScalarMult(vec1, vec2){
    return vec1.x * vec2.x + vec1.y * vec2.y;
}

function mySqrtOfVec(vec){
    return myDiv(vec, sqrt(myMagnitude(vec)));
}

function mySqrtOfVec2(vec){
    return myChangeMag(vec, sqrt(myMagnitude(vec)));
}

function mySqrOfVec(vec){
    return myMult(vec, myMagnitude(vec));
}

function mySqrOfVec2(vec){
    return myChangeMag(vec, myMagnitude(vec)**2);
}

function myChangeDir(vec, angle){

}

function myChangeDirToVec(vec, vecTo){
    return myMult(vecTo, myMagnitude(vec)/myMagnitude(vecTo));
}

function myVecfromAngle(length, angle){
    return{x: length * cos(angle), y: length * sin(angle)};
}

function myRotateVec(vec, angle){
    return {x: vec.x * cos(angle)  - vec.y * sin(angle), y: vec.x * sin(angle) + vec.y * cos(angle)};
}

function clamp(x, min, max){
    return Math.max(min, Math.min(x, max) );
}

function drawArrow(base, vec, myColor = "red") {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(myHeading(vec));
  let arrowSize = 7;
  translate(myMagnitude(vec) - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function drawArrowWithName(base, vec, name, myColor = "red"){
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(myHeading(vec));
    let arrowSize = 7;
    translate(myMagnitude(vec) - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    translate(0, 10)
    rotate(-myHeading(vec));
    scale(1.2);
    stroke(0);
    strokeWeight(1);
    text(name, 0, 0)
    pop();
}

function relativeVelocity(VelOfTargetPoint, referencePointVel){
    // var resultX = (VelOfTargetPoint.x - referencePointVel.x) / (1 - (VelOfTargetPoint.x*referencePointVel.x) / (c**2));
    // var resultY = (VelOfTargetPoint.y - referencePointVel.y) / (1 - (VelOfTargetPoint.y*referencePointVel.y) / (c**2));

    // return {x: resultX, y: resultY};

    return myDiv(mySub(VelOfTargetPoint, referencePointVel), (1 - (myMagnitude(VelOfTargetPoint)*myMagnitude(referencePointVel))/(c**2)))
}
function lerp(a, b, i){
    return (1 - i) * a + i * b;
}

function myExtend(obj, deep) {
    var argsStart,
        args,
        deepClone;

    if (typeof deep === 'boolean') {
        argsStart = 2;
        deepClone = deep;
    } else {
        argsStart = 1;
        deepClone = true;
    }

    for (var i = argsStart; i < arguments.length; i++) {
        var source = arguments[i];

        if (source) {
            for (var prop in source) {
                if (deepClone && source[prop] && source[prop].constructor === Object) {
                    if (!obj[prop] || obj[prop].constructor === Object) {
                        obj[prop] = obj[prop] || {};
                        myExtend(obj[prop], deepClone, source[prop]);
                    } else {
                        obj[prop] = source[prop];
                    }
                } else {
                    obj[prop] = source[prop];
                }
            }
        }
    }
    
    return obj;
};

function myClone(obj, deep) {
    return myExtend({}, deep, obj);
};

function myMatrixMultByVec(matrix, vec){ // console.log(myMatrixMultByVec([[1,2],[3,4]], [5, 7])) [19, 43] - работает
    // matrix = 
    // [[a, b],
    //  [c, d]];
    return [matrix[0][0] * vec[0] + matrix[0][1] * vec[1], matrix[1][0] * vec[0] + matrix[1][1] * vec[1]];
}

function myMatrixMultByNum(matrix, num){
    for(var i = 0; i < matrix.length; i++){
       for(var j = 0; j < matrix[i].length; j++){
            matrix[i][j] *= num;
        };
    };
    return matrix;
}

function myMatrixDet(matrix){
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function myMatrixTranspon(matrix){
    return [[matrix[0][0], matrix[1][0]], [matrix[0][1], matrix[1][1]]];    // returen
}

function myReverseMatrix(matrix){
    var det = myMatrixDet(matrix);
    var minorMatrix = 
    [[matrix[1][1], matrix[1][0]],
     [matrix[0][1], matrix[0][0]]];
    var algebraicAddition = 
    [[minorMatrix[0][0], -minorMatrix[0][1]],
     [-minorMatrix[1][0], minorMatrix[1][1]]];
    return myMatrixMultByNum(myMatrixTranspon(algebraicAddition), 1/det);
}

function myFastReverseMatrix(matrix){
    var det = myMatrixDet(matrix);
    var aAT = [
    [matrix[1][1],-matrix[0][1]],
    [-matrix[1][0],matrix[0][0]]];
    return myMatrixMultByNum(aAT, 1/det);
}
