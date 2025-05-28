let asteroids = []
let enemies = []
let bulletsEnemy = []
let player
let pauseGame = false
let naveEnemyL1
let naveEnemyL2
let naveEnemyL3
let boss
let playerImage
let bulletsPlayer = []
let score = 0
let gameOver = false
let gameWin = false
let particlesDestruction = []
let level = 1
let cantEnemiesByLevel = 10
let cantEnemiesGenerated = 0
let cantEnemiesWithLife = 0
let cantEnemiesToGenerate = 3
let fondo


function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setup() {
    createCanvas(800, 600);
    boss = loadImage('j1.png'); 

    naveEnemyL1 = loadImage('ship.png'); 
    naveEnemyL2 = loadImage('ship2.png'); 
    naveEnemyL3 = loadImage('ship3.png'); 

    playerImage = loadImage('player.png')
    fondo = loadImage('fondo.jpg')
    player = new Player(100,400,1,50,50,5,'white',0)

    for(let i = 0;i<40; i++){
        asteroids[i] = new Asteroid(randomNumber(0,800),-5,3,3,randomNumber(1,4),'white')
    }
    setTimeout(inicializedEnemies, 3000);

}
  
function draw() {
    background('black')
    image(fondo, 0,0, 800, 600); 

    //bordes
    fill('blue')
    rect(0,0,5,600)
    fill('blue')
    rect(0,0,800,5)
    fill('blue')
    rect(0,595,800,5)
    fill('blue')
    rect(795,0,5,600)

    //asteroides
    for(var i = 0;i<asteroids.length;i++){
        if(!pauseGame){
            if(asteroids[i].y+asteroids[i].speed > 600){
                asteroids[i].genNewCoords()
            }else{
                asteroids[i].moveAsteroid()
            }
        }
        fill('white')
        rect(asteroids[i].x,asteroids[i].y,asteroids[i].width,asteroids[i].height)
    }

    //enemies
    for(var i = 0;i<enemies.length;i++){
        if(!pauseGame){
            if(enemies[i].health > 0){
                if(enemies[i].y+enemies[i].speed > 600){
                    enemies[i].genNewCoords()
                }else{
                    enemies[i].moveEnemy()
                    if(randomNumber(0,100) == 0 && level > 1){
                        shotShipEnemy(enemies[i])       
                    }
                }
            }
            
        }
        image(naveEnemyL1, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height); 
    }

    //bullets enemy
    for(var i = 0;i<bulletsEnemy.length;i++){
        if(!pauseGame || !gameWin){
            bulletsEnemy[i].moveBullet('enemy')
            validateCollision(bulletsEnemy[i],'bulletEnemyWithPlayer')

        }
        fill('red')
        rect(bulletsEnemy[i].x,bulletsEnemy[i].y,bulletsEnemy[i].width,bulletsEnemy[i].height)
    }

    // bullets player
    for(var i = 0;i<bulletsPlayer.length;i++){
        if(!pauseGame){
            bulletsPlayer[i].moveBullet('player')
            validateCollision(bulletsPlayer[i],'bulletWithEnemy')
        }
        fill('yellow')
        rect(bulletsPlayer[i].x,bulletsPlayer[i].y,bulletsPlayer[i].width,bulletsPlayer[i].height)
    }

    //move particles destroy
    for(var i = 0;i<particlesDestruction.length;i++){
        if(!pauseGame){
            particlesDestruction[i].move()
        }
        fill(11,255,232)
        rect(particlesDestruction[i].x,particlesDestruction[i].y,particlesDestruction[i].width,particlesDestruction[i].height)
    }

    //player
    if(!pauseGame && !gameOver){
        player.move()

    }
    if(!gameOver){
        image(playerImage, player.x, player.y, player.width, player.height); 
    }

    if(pauseGame){
        fill('white')   
        textSize(32);       
        textAlign(CENTER, CENTER); 
        text('PAUSA', width / 2, height / 2 - 100);
    
        fill('white')
        textSize(32);       
        textAlign(CENTER, CENTER); 
        text('Presiona P para desactivarla', width / 2, height / 2 );
    }

    fill('white')
    textSize(28);       
    textAlign(CENTER, CENTER); 
    text('Vida', 80,30);

    fill('white')
    textSize(28);       
    textAlign(CENTER, CENTER); 
    text(player.health, 130,30);

    fill('white')
    textSize(28);       
    textAlign(CENTER, CENTER); 
    text('Score', 200,30 );

    fill('white')
    textSize(28);       
    textAlign(CENTER, CENTER); 
    text(score, 260,30);

    fill('white')
    textSize(28);       
    textAlign(CENTER, CENTER); 
    text('Level '+level, 340,30);

    if(gameOver){
        fill('red');   
        textSize(32);       
        textAlign(CENTER, CENTER); 
        text('GAME OVER', width / 2, height / 2 - 100);
    
        fill('white');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Tu score fue ' + score, width / 2, height / 2 );
        
        fill('white');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Presiona la tecla R para reiniciar', width / 2, height / 2 + 30);
    }
    if(gameWin){
        fill('green');   
        textSize(32);       
        textAlign(CENTER, CENTER); 
        text('HAZ GANADO!!!', width / 2, height / 2 - 100);
    
        fill('white');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Tu score fue ' + score, width / 2, height / 2 );
        
        fill('white');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Presiona la tecla R para volver a inicar', width / 2, height / 2 + 30);
    }
    

}

function validateCollision(obj1,typeCollision){
    switch(typeCollision){
        case 'bulletWithEnemy':
            for(let e of enemies){
                if(e.health > 0){
                    if(collision(obj1,e)){
                        if(e.health - 1 <= 0){
                            generateParticlesDestroy(e)
                            cantEnemiesWithLife -= 1
                           // cantEnemies -= 1
                            e.y = -50
                            score += 15
                            if(cantEnemiesGenerated < cantEnemiesByLevel){
                                inicializedEnemies()
                            }else{
                                if(cantEnemiesWithLife == 0){
                                    if(level == 3){
                                        gameWin = true
                                    }else{
                                        loadVariablesToNextLevel()
                                        inicializedEnemies()
                                    }
                                    
                                }
                                
                            }
    
                        }
                        e.health -= 1
                        obj1.y = -10
                       
                        break
                    }
                }
            }
        break
        case 'bulletEnemyWithPlayer':
            if(collision(obj1,player)){
                obj1.y = 640
                if(player.health - 1 > 0){
                    player.health -= 1
                }else{
                    if(!gameOver){
                        gameOver = true
                        generateParticlesDestroy(player)
                        player.health = 0
                    }
                   
                }
                
            }

        break
    }

    function collision(obj1,obj2){
        if(obj2.x + obj2.width >= obj1.x && obj2.x <= obj1.x && obj2.y + obj2.height >= obj1.y && obj2.y <= obj1.y){
            return true
        }
        return false

    }

}

function loadVariablesToNextLevel(){
    cantEnemiesGenerated = 0
    cantEnemiesWithLife = 0
    enemies = []
    switch(level + 1){
        case 2:
            level = 2
            cantEnemiesByLevel = 12
            cantEnemiesToGenerate = 4
        break
        case 3:
            level = 3
            cantEnemiesByLevel = 15
            cantEnemiesToGenerate = 4
        break
        default: 
            level = 'secret'
            cantEnemiesByLevel = 15
            cantEnemiesToGenerate = 7
        break
    }
    
    
}

function generateParticlesDestroy(enemy){
    let cantParticles = 5
    for(let i2 = 0;i2<cantParticles;i2++){
        if(particlesDestruction.length == 0 || particlesDestruction.length < 40){
            particlesDestruction.push(new Particles(enemy.x + enemy.width / 2,enemy.y + enemy.height / 2,5,5,randomNumber(5,9),'blue',getDirection(randomNumber(0,7))))
        }else{
            for(let i = 0;i<particlesDestruction.length;i++){
                if(particlesDestruction[i].x < 0 || particlesDestruction[i].x > 800 ||
                    particlesDestruction[i].y < 0 ||  particlesDestruction[i].y > 600){
                        particlesDestruction[i].x = enemy.x + enemy.width / 2
                        particlesDestruction[i].y = enemy.y + enemy.height / 2
                        particlesDestruction[i].direction = getDirection(randomNumber(0,7))
                    break
                }
            }
        }
    }
    

}

function getDirection(direction){
    switch(direction){
        case 0:
            return 'top'
        break
        case 1:
            return 'down'
        break
        case 2:
           return 'right'
        break
        case 3:
           return 'left'
        break
        case 4:
          return 'topRight'
        break
        case 5:
            return 'topLeft'
        break
        case 6:
           return 'downRight'
        break
        case 7:
           return 'downLeft'
        break
    }
}



function resetGame(){
    player = new Player(100,400,5,50,50,5,'white',0)
    gameWin = false
    bulletsEnemy = []
    level = 1
    enemies = []
    cantEnemiesByLevel = 10
    cantEnemiesGenerated = 0
    cantEnemiesWithLife = 0
    cantEnemiesToGenerate = 3
    setTimeout(inicializedEnemies, 3000);
   
   
}

function inicializedEnemies(){
    let speed
    if(level == 1){
        speed = 1
    }
    if(level == 2){
        speed = 3
    }
    if(level == 3){
        speed = 4
    }

    while(cantEnemiesWithLife < cantEnemiesToGenerate){
        enemies.push(new Enemy(randomNumber(20,760),-5,5,50,50,speed,'white'))
        cantEnemiesWithLife++
        cantEnemiesGenerated++
    }
   
}


function keyPressed() {
    if(!gameOver && !gameWin){
        if (key === 'p' || key === 'P') {
            pauseGame = !pauseGame;
            
        }
    }
    if(gameOver || gameWin){
        if (key === 'r' || key === 'R') {
            resetGame()
            gameOver = false
            
        }
    }
   
    if(!pauseGame && !gameOver &&!gameWin){
        if (keyCode === LEFT_ARROW) {
            player.direction = 0 
        }
        if (keyCode === RIGHT_ARROW) {
            player.direction = 1
        }
        if(keyCode === UP_ARROW) {
            player.direction = 2
          }
        if(keyCode === DOWN_ARROW) {
            player.direction = 3
        }
        if(keyCode === 32) {
            player.shot(bulletsPlayer)
        }
    }
   
  }
  

function shotShipEnemy(enemy){
    if(bulletsEnemy.length == 0 || bulletsEnemy.length < 50){
        bulletsEnemy.push(new Bullet(enemy.x,enemy.y,5,5,12,randomNumber(3,7),'red'))
    }else{
        for(var i2 = 0;i2<bulletsEnemy.length;i2++){
            if(bulletsEnemy[i2].y >= 600){
                bulletsEnemy[i2].x = enemy.x
                bulletsEnemy[i2].y = enemy.y
                bulletsEnemy[i2].speed = 5
                break;
            }
        }
    }
}

  