class Bullet{
    constructor(x,y,health,width,height,speed,color){
        this.x = x
        this.y = y
        this.health = health
        this.width = width
        this.height = height
        this.speed = speed
        this.color = color
    }

    moveBullet(typeBullet){
        if(typeBullet == 'player'){
           if(this.y > -30){
                this.y -= this.speed
           }
            
        }
        if(typeBullet == 'enemy'){
            if(this.y < 660){
                this.y += this.speed
            }
        }
    }

    genNewCoords(){
        this.x = randomNumber(0,800)
        this.y = randomNumber(-3,-13)
        this.speed = randomNumber(1,4)
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}