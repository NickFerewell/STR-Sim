class StateMachine {
    constructor(){
        var currentState = null; //Так лучше не делать
    }

    changeState(newState){
        if (currentState){
            currentState.exit();
        }

        currentState = newState;

        if (currentState){
            currentState.enter(this); //onEnter, start
        }
    }

    getCurrentState(){
        return currentState;
    }

    update(){
        if(currentState){
            currentState.update(this);
        }
    }
}