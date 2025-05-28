class Player{
    constructor(x,y,health,width,height,speed,color,direction){
        this.x = x
        this.y = y
        this.health = health
        this.width = width
        this.height = height
        this.speed = speed
        this.color = color
        this.direction = direction
    }

    move(){
       if(this.direction == 0){
        if(this.x - this.speed < 0){
            this.x = 800

        }else{
            this.x -= this.speed
        }
       }
       if(this.direction == 1){
        if(this.x + this.speed > 800){
            this.x = 0
        }else{
            this.x += this.speed
        }
       }
       if(this.direction == 2){
        if(this.y - this.speed < 0){
            this.y = 600
        }else{
            this.y -= this.speed
        }
       }
       if(this.direction == 3){
        if(this.y + this.height + this.speed > 600){
            this.y = -20
        }else{
            this.y += this.speed
        }
       } 
    }

    genNewCoords(){
        this.x = randomNumber(0,800)
        this.y = randomNumber(-3,-13)
        this.speed = randomNumber(1,4)
    }

    shot(bullets){
        if(bullets.length == 0 || bullets.length < 30){
            bullets.push(new Bullet(this.x + this.width / 2,this.y,5,5,12,6,'blue'))
        }else{
            for(let i = 0; i < bullets.length;i++){
                if(bullets[i].y <= 0){
                    bullets[i].x = this.x + this.width / 2
                    bullets[i].y = this.y
                    break
                }
            }
        }
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}