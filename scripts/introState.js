class IntroState{
    constructor(){
        this.imageNumber = 0;
        this.imageList = [
            "intro1",
            "intro2",
            "intro3",
        ];
        this.imageHolderElement;
        this.introComplete = false;
    }

    enter(stateMachine){
        //start displaying images;
        var imageHolderElement = document.createElement("IMG", { src: "images/" + this.imageList[this.imageNumber], style: {transition: "1.5s"}});
        document.getElementById("content").appendChild(imageHolderElement);
    }

    update(stateMachine){
        if(introComplete){
            // change the state!
            stateMachine.changeState(new GameState());
        } else {
            // play the intro
            if(keyboard.anyKeyPressed){
                this.nextImage();
            }
        }
    }

    nextImage(){
        this.imageNumber += 1;
        this.image = this.imageList[this.imageNumber];
        this.imageHolderElement.src = image;

        if (this.imageNumber + 1 == this.imageList.length){
            this.introComplete = true;
        }
    }

    exit(){
        // nothing to do.. maybe free some stuff?
        this.imageHolderElement.style.color = "000000";
    }
}