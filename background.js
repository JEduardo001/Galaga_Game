class Asteroid{

    constructor(x,y,width,height,speed,color){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.color = color
    }

    moveAsteroid(){
        this.y += this.speed
    }

    genNewCoords(level){
        this.x = randomNumber(0,800)
        this.y = randomNumber(-3,-13)
        if(level == 3){
            this.speed = randomNumber(8,14)

        }else{
            this.speed = randomNumber(1,4)

        }
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    changeColor(level){
        if(level == 3){
            this.color = 'orange'
        }else{
            this.color = 'white'
        }
    }
      
}