class Enemy{
    constructor(x,y,health,width,height,speed,color,level,manyHits,direction,isBoss){
        this.x = x
        this.y = y
        this.health = health
        this.width = width
        this.height = height
        this.speed = speed
        this.color = color
        this.level = level
        this.manyHits = manyHits
        this.direction = direction
        this.isBoss = isBoss
    }

    moveEnemy(){
        if(this.level == 1){
            this.y += this.speed
        }
        if(this.level == 2){
            if(this.x > 800){
                this.x = -30
                this.y += this.height
            }else{
                this.x += this.speed
            }
        }
        if(this.level == 3){
            if(randomNumber(0,15) == 3){
                this.direction = randomNumber(0,7)
            }
            this.move()
        }
       
    }

     move(){
        switch(this.direction){
           /*  case 'top':
                if(this.y > -20){
                    this.y -= this.speed
                }
            break */
            //down
            case 1:
                if(this.y < 620){
                    this.y += this.speed
                }
            break
            //right
            case 2:
                if(this.x < 800){
                    this.x += this.speed
                }else{
                    this.x = 0
                }
            break
            //left
            case 3:
                if(this.x > -20){
                    this.x -= this.speed
                }else{
                    this.x = 800
                }
            break
            //top right
            case 4:
                if(this.y > -20 && this.x < 820){
                    this.y -= this.speed
                    this.x += this.speed
                }else{
                    this.x = 0
                }
            break
            //top left
            case 5:
                if(this.y > -20 && this.x > -20){
                    this.y -= this.speed
                    this.x -= this.speed
                }else{
                    this.x = 800
                }
            break
            //down right
            case 6:
                if(this.y < 620 && this.x < 820){
                    this.y += this.speed
                    this.x += this.speed
                }else{
                    this.x = 0
                }
            break
            //down left
            case 7:
                if(this.y < 620 && this.x > -20){
                    this.y += this.speed
                    this.x -= this.speed
                }else{
                    this.x = 800
                }
                
            break
        }
    }
    

    genNewCoords(){
        this.x = randomNumber(0,800)
        this.y = randomNumber(-3,-13)
        //this.speed = randomNumber(1,4)
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}