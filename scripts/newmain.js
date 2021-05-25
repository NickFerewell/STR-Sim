var game = null;
var runGame = true;

function setup(){
    game = new StateMachine();
    game.changeState(new IntroState());
}

function draw(){
    while(runGame){
        game.update();
    }
}