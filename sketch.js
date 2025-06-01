let asteroids = []
let enemies = []
let bulletsEnemy = []
let player
let pauseGame = false
let naveEnemyL1
let naveEnemyL2
let naveEnemyL3
let nave3Health
let heart
let heartSpacePx = 30
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
let generateBoss = false
let spaceText = -10
let gameWithoutStarting = true
let puntuaciones = []
let showTransitionToNextLevel = false
let colisionEnemyWithPlayer = true
let music1,music2,music3
let soundShotPlayer,soundShotEnemy,soundExplosionEnemy1,soundExplosionEnemy2,soundExplosionBoss
let soundGameOver,soundGameWin
let soundCollisionEnemyWithPlayer

//12FVc78mop


function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function preload() {
  music1 = loadSound('music/music3.mp3');
  music2 = loadSound('music/music4.mp3');
  soundExplosionEnemy1 = loadSound('effectSong/explosion/explo2.wav');
  soundExplosionEnemy2 = loadSound('effectSong/explosion/explo3.wav');
  soundExplosionBoss = loadSound('effectSong/explosion/explo4.wav');
  soundShotEnemy = loadSound('effectSong/shot/shot2.wav');
  soundShotPlayer = loadSound('effectSong/shot/shot1.wav');
  soundGameOver  = loadSound('effectSong/gameOver.wav');
  soundGameWin= loadSound('effectSong/gameWin.wav');
  soundCollisionEnemyWithPlayer= loadSound('effectSong/explosion/crash.wav');
}


function setup() {
    createCanvas(800, 600);
    boss = loadImage('j1.png'); 

    naveEnemyL1 = loadImage('ship.png'); 
    naveEnemyL2 = loadImage('ship2.png'); 
    naveEnemyL3 = loadImage('ship3.png'); 
    nave3Health = loadImage('ship4.png')
    playerImage = loadImage('player.png')
    heart = loadImage('heart.png')
    fondo = loadImage('fondo.jpg')

    for(let i = 0;i<40; i++){
        asteroids[i] = new Asteroid(randomNumber(0,800),-5,3,3,randomNumber(1,4),'white')
    }
    
    puntuaciones = JSON.parse(localStorage.getItem('topScore'));
    if (puntuaciones == null) {
        console.log("No hay top")
        puntuaciones = []
        puntuaciones.push(0)
        puntuaciones.push(0)
        puntuaciones.push(0)
        puntuaciones.push(0)
        puntuaciones.push(0)
    }
    music1.play()

    music1.onended(() => {
       music2.play()
    });
    music2.onended(() => {
        music1.play()
    });
}
  
function startGame(){
    player = new Player(100,500,3,50,50,5,'white',0)
    showTransitionToNextLevel = true
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
                asteroids[i].genNewCoords(level)
                asteroids[i].changeColor()
            }else{
                asteroids[i].moveAsteroid()
            }
        }
        fill(asteroids[i].color)
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
                    if(enemies[i].y >= 600){
                        restHealthPlayer()
                    }
                    validateCollision(enemies[i],'enemyWithPlayer')
                    if(randomNumber(0,100) == 0 && level > 1){
                        shotShipEnemy(enemies[i])       
                        soundShotEnemy.play()
                    }
                }
            }   
        }
        if(enemies[i].manyHits == 3){
            image(nave3Health, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height); 
        }else{
            if(enemies[i].level == 1){
                image(naveEnemyL1, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height); 
            }
            if(enemies[i].level == 2){
                image(naveEnemyL2, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height); 
            }
            if(enemies[i].level == 3){
                if(enemies[i].isBoss == true){
                    image(boss, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height); 
                }else{
                    image(naveEnemyL3, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height); 

                }
            }
        }
       
    }

    //bullets enemy
    for(var i = 0;i<bulletsEnemy.length;i++){
        if(!pauseGame && !gameWin){
            bulletsEnemy[i].moveBullet('enemy')
            validateCollision(bulletsEnemy[i],'bulletEnemyWithPlayer')

        }
        fill(bulletsEnemy[i].color)

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
        //11,255,232
        fill(particlesDestruction[i].color)
        rect(particlesDestruction[i].x,particlesDestruction[i].y,particlesDestruction[i].width,particlesDestruction[i].height)
    }

    //player
    if(!gameWithoutStarting){
        if(!pauseGame && !gameOver){
            player.move()
        }
        if(!gameOver){
            image(playerImage, player.x, player.y, player.width, player.height); 
        }
    }
    
   

    if(pauseGame){
        fill('white')   
        textSize(38);       
        textAlign(CENTER, CENTER); 
        text('PAUSA', width / 2, height / 2 - 140);
    
        fill('#32f166')
        textSize(32);       
        textAlign(CENTER, CENTER); 
        text('Presiona P para desactivarla', width / 2, height / 2 -50 );

        showControls(true)
    }

    if(!gameWithoutStarting){
        showDetailsLevel()
    }
    
    if(gameOver){
        fill('red');   
        textSize(35);       
        textAlign(CENTER, CENTER); 
        text('GAME OVER', width / 2, height / 2 - 150);
    
        fill('white');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Tu score fue ' + score, width / 2, height / 2 - 90 );
        
        fill('#32f166');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Presiona la tecla R para reiniciar', width / 2, height / 2 + 180);

        showTopScore()
    }
    if(gameWin){
        fill('#0dffd7');   
        textSize(35);       
        textAlign(CENTER, CENTER); 
        text('HAZ GANADO!!!', width / 2, height / 2 - 150);
    
        fill('white');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Tu score fue ' + score, width / 2, height / 2 - 90 );
        
        fill('white');
        textSize(27);       
        textAlign(CENTER, CENTER); 
        text('Presiona la tecla R para volver a iniciar', width / 2, height / 2 + 180);

        showTopScore()

    }
    if(gameWithoutStarting){
        contentGameWithoutStarting()
    }

    if(showTransitionToNextLevel){
        fill('cyan');
        textSize(30);       
        textAlign(CENTER, CENTER); 
        text("Level " + level, width / 2, height / 2 - 100);
        //setTimeout(inicializedEnemies, 3000);

    }

    
    

}

function contentGameWithoutStarting(){
    fill('cyan');   
    textSize(35);       
    textAlign(CENTER, CENTER); 
    text('SPACE JAM', width / 2, height / 2 - 150);
    
    fill('#32f166');
    textSize(27);       
    textAlign(CENTER, CENTER); 
    text('Presiona la tecla F para empezar', width / 2, height / 2 - 100);
    if(puntuaciones.length != 0){
       showTopScore()
    }
    showControls(false)
}

function validateCollision(obj1,typeCollision){
    switch(typeCollision){
        case 'bulletWithEnemy':
            for(let e of enemies){
                if(e.health > 0){
                    if(collision(obj1,e)){
                        if(e.health - 1 <= 0){
                            generateParticlesDestroy(e)
                            soundExplosionEnemy1.play()
                            cantEnemiesWithLife -= 1
                            e.y = -100
                           
                            if(e.isBoss){
                                score += 10
                                soundExplosionBoss.play()
                            }else{
                                if(e.manyHits == 3){
                                    score += 3
                                }else{
                                    score += 1
                                }
                                if(randomNumber(0,1) == 0) {
                                    soundExplosionEnemy1.play()
                                }else{
                                    soundExplosionEnemy2.play()
                                }
                            }
                            
                          
                            if(cantEnemiesGenerated < cantEnemiesByLevel){
                                inicializedEnemies()
                            }else{
                                if(cantEnemiesWithLife == 0){
                                    if(level == 3){
                                        soundGameWin.play()
                                        gameWin = true
                                        validateTopScore()
                                        saveTopScore()
                                    }else{
                                        loadVariablesToNextLevel()
                                        showTransitionToNextLevel = true
                                        setTimeout(nextLevel, 3000);

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
                restHealthPlayer()
                
            }
        break
        case 'enemyWithPlayer':
            if(collision(obj1,player) && colisionEnemyWithPlayer){
                generateParticlesDestroy(player)
                //console.log("e.x",+ obj1.x + "e.y"+ obj1.y + "player.x" +player.x + "player.y"+ player.y)
                soundCollisionEnemyWithPlayer.play()
                colisionEnemyWithPlayer = false
                restHealthPlayer()
                setTimeout(activateCollisionEnemyWithPlayer, 1500);
            }
        break
    }

    function collision(obj1,obj2){
        //obj2.x + obj2.width >= obj1.x && obj2.x <= obj1.x && obj2.y + obj2.height >= obj1.y && obj2.y <= obj1.y
        //esquina izquierda arriba, derecha arriba, izquierda abajo, derecha abajo
        if(obj1.x <= obj2.x + obj2.width && obj1.x >= obj2.x && obj1.y >= obj2.y && obj1.y <= obj2.y + obj2.height 
            || obj1.x + obj1.width <= obj2.x + obj2.width && obj1.x + obj1.width >= obj2.x && obj1.y >= obj2.y && obj1.y <= obj2.y + obj2.height
            || obj1.x <= obj2.x + obj2.width && obj1.x >= obj2.x && obj1.y + obj1.height >= obj2.y && obj1.y + obj1.height <= obj2.y + obj2.height 
            || obj1.x + obj1.width <= obj2.x + obj2.width && obj1.x + obj1.width >= obj2.x && obj1.y + obj1.height >= obj2.y && obj1.y + obj1.height <= obj2.y + obj2.height
        ){
            return true
        }
        return false

    }

}

function activateCollisionEnemyWithPlayer(){
    colisionEnemyWithPlayer = true
}

function nextLevel(){
    initLevel()
    inicializedEnemies()
}

function restHealthPlayer(){
    if(player.health - 1 > 0){
        player.health -= 1
    }else{
        if(!gameOver){
            gameOver = true
            soundGameOver.play()
            validateTopScore()
            saveTopScore()
            generateParticlesDestroy(player)
            player.health = 0
        }
       
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
            cantEnemiesToGenerate = 3
        break
        case 3:
            level = 3
            cantEnemiesByLevel = 15
            cantEnemiesToGenerate = 3
        break
        default: 
            level = 'secret'
            cantEnemiesByLevel = 15
            cantEnemiesToGenerate = 7
        break
    }
    
    
}

function generateParticlesDestroy(enemy){
    let cantParticles
    let color
    if(enemy.isBoss){
        cantParticles = 16
        color = "#0BFF44"
    }else{
        cantParticles = 5
        color = "cyan"
    }
    for(let i2 = 0;i2<cantParticles;i2++){
        if(particlesDestruction.length == 0 || particlesDestruction.length < 40){
            particlesDestruction.push(new Particles(enemy.x + enemy.width / 2,enemy.y + enemy.height / 2,5,5,randomNumber(5,9),color,getDirection(randomNumber(0,7))))
        }else{
            for(let i = 0;i<particlesDestruction.length;i++){
                if(particlesDestruction[i].x < 0 || particlesDestruction[i].x > 800 ||
                    particlesDestruction[i].y < 0 ||  particlesDestruction[i].y > 600){
                        particlesDestruction[i].x = enemy.x + enemy.width / 2
                        particlesDestruction[i].y = enemy.y + enemy.height / 2
                        particlesDestruction[i].direction = getDirection(randomNumber(0,7))
                        particlesDestruction[i].color = color

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
    player = new Player(100,500,3,50,50,5,'white',0)
    score = 0
    gameWin = false
    bulletsEnemy = []
    level = 1
    enemies = []
    cantEnemiesByLevel = 10
    cantEnemiesGenerated = 0
    cantEnemiesWithLife = 0
    cantEnemiesToGenerate = 3
    showTransitionToNextLevel = true
    setTimeout(inicializedEnemies, 3000);
   
   
}

function initLevel(){
    if(level == 2){
        enemies.push(new Enemy(randomNumber(20,760),-5,3,50,50,1,'white',level,3,randomNumber(2,3),false))
        cantEnemiesWithLife = 1
        cantEnemiesGenerated = 1
    }
    if(level == 3){
        enemies.push(new Enemy(randomNumber(20,760),-5,3,50,50,3,'white',level,3,randomNumber(0,7),false))
        enemies.push(new Enemy(randomNumber(20,760),-5,3,50,50,3,'white',level,3,randomNumber(0,7),false))
        cantEnemiesWithLife = 2
        cantEnemiesGenerated = 2
        generateBoss = true

    }
}

function inicializedEnemies(){
    showTransitionToNextLevel = false
    let speed = 1
    let health = 1
    if(level == 3){
        speed = 3   
        health = 1
        if(generateBoss){
            enemies.push(new Enemy(randomNumber(20,760),-5,7,100,100,4,'white',level,1,0,true))
            generateBoss = false
            cantEnemiesWithLife++

        }
    }
    

    while(cantEnemiesWithLife < cantEnemiesToGenerate){
        enemies.push(new Enemy(randomNumber(20,760),-5,1,50,50,speed,'white',level,1,0,false))
        cantEnemiesWithLife++
        cantEnemiesGenerated++
    }
}

function validateTopScore(){
    let positionInsert
    let antScore
    
    //buscamos la posicion donde se introducira el nuevo record
    for(let i = puntuaciones.length - 1;i > -1; i--){
        if(score > puntuaciones[i]){
            positionInsert = i
        }
    }
    //reorganizamos el top score
    for(let i = puntuaciones.length - 1;i >= positionInsert; i--){
        if(i == positionInsert){
            puntuaciones[i] = score
            break
        }
        antScore = puntuaciones[i]
        puntuaciones[i] = puntuaciones[i - 1]
        puntuaciones[i - 1] = antScore
        
    }
}


function keyPressed() {
    if(!gameOver && !gameWin && !gameWithoutStarting){
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
    if(gameWithoutStarting){
        if(key === 'F' || key === 'f'){
            gameWithoutStarting = false
            startGame()
        }
       
    }
    if(key == 'K' || key == 'k'){
        localStorage.removeItem('topScore');
    }
   
    if(!pauseGame && !gameOver && !gameWin && !gameWithoutStarting){
        if (keyCode === LEFT_ARROW) {
            player.direction = 0 
        }
        if (keyCode === RIGHT_ARROW) {
            player.direction = 1
        }
       /*  if(keyCode === UP_ARROW) {
            player.direction = 2
          }
        if(keyCode === DOWN_ARROW) {
            player.direction = 3
        } */
        if(keyCode === 32) {
            player.shot(bulletsPlayer)
            soundShotPlayer.play()
        }
    }
   
  }
  
  
function shotShipEnemy(enemy){
    if(bulletsEnemy.length == 0 || bulletsEnemy.length < 50){
        bulletsEnemy.push(new Bullet(enemy.x,enemy.y,5,5,12,getSpeedBullet(enemy),getColorBulltet(enemy)))
    }else{
        for(var i2 = 0;i2<bulletsEnemy.length;i2++){
            if(bulletsEnemy[i2].y >= 600){
                bulletsEnemy[i2].color = getColorBulltet(enemy)
                if(enemy.isBoss){
                    bulletsEnemy[i2].x = enemy.x
                    bulletsEnemy[i2].y = enemy.y
                    bulletsEnemy[i2].speed = 11

                }else{
                    if(enemy.level == 2){
                        bulletsEnemy[i2].speed = 8
                    }
                    if(enemy.level == 1){
                        bulletsEnemy[i2].speed = 5
                    }
                    bulletsEnemy[i2].x = enemy.x    
                    bulletsEnemy[i2].y = enemy.y

                }
                
                break;
            }
        }
    }
}

function getColorBulltet(enemy){
    if(enemy.isBoss){
        return 'blue'

    }else{
        return 'red'
    }
}
function getSpeedBullet(enemy){
    if(enemy.isBoss){
        return 11
    }else{
        return 5
    }
}

function showDetailsLevel(){
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

    for(let i=0;i<player.health;i++){
        image(heart, 10,50 + heartSpacePx, 50, 50); 
        heartSpacePx += 50
    }
    heartSpacePx = 30

}
function saveTopScore(){
    localStorage.setItem('topScore', JSON.stringify(puntuaciones));

}

function showControls(textCenter){
    let widthText 
    if(textCenter){
        widthText = width
    }else{
        widthText = width + 450
    }

    fill('white')
    textSize(27)
    textAlign(CENTER, CENTER)
    text('Controles', widthText / 2, height / 2 - 10)
    textSize(22)
    //text('Arriba: flecha arriba', widthText / 2, height / 2 + 40)
    //text('Abajo: flecha abajo', widthText / 2, height / 2 + 80)
    text('Derecha: flecha derecha', widthText / 2, height / 2 + 40)
    text('Izquierda flecha izquierda', widthText / 2, height / 2 + 80)
    text('Pausa: tecla P', widthText / 2, height / 2 + 120)
    text('Disparo: tecla space', widthText / 2, height / 2 + 150)

}

function showTopScore(){
    fill('#ebfe31');
    textSize(27);       
    textAlign(CENTER, CENTER); 
    text('Top 5 Mejores', width / 2, height / 2 - 50);

    for(let i =0;i<puntuaciones.length;i++){
        if(i == 0 ){
            fill('#ebfe31');
        }else{
            fill('white');
        }
        textSize(22);       
        textAlign(CENTER, CENTER); 
        text(i + 1 + '. ' + puntuaciones[i], width / 2, height / 2 + spaceText );
        spaceText += 30
    }
    spaceText = -10
}

  