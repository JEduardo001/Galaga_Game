class Particles{
    constructor(x,y,width,height,speed,color,direction){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.color = color
        this.direction = direction
    }

    move(){
        switch(this.direction){
            case 'top':
                if(this.y > -20){
                    this.y -= this.speed
                }
            break
            case 'down':
                if(this.y < 620){
                    this.y += this.speed
                }
            break
            case 'right':
                if(this.x < 820){
                    this.x += this.speed
                }
            break
            case 'left':
                if(this.x > -20){
                    this.x -= this.speed
                }
            break
            case 'topRight':
                if(this.y > -20 && this.x < 820){
                    this.y -= this.speed
                    this.x += this.speed
                }
            break
            case 'topLeft':
                if(this.y > -20 && this.x > -20){
                    this.y -= this.speed
                    this.x -= this.speed
                }
            break
            case 'downRight':
                if(this.y < 620 && this.x < 820){
                    this.y += this.speed
                    this.x += this.speed
                }
            break
            case 'downLeft':
                if(this.y < 620 && this.x > -20){
                    this.y += this.speed
                    this.x -= this.speed
                }
            break
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