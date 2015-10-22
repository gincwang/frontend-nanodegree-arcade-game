//"use strict"

//Game variables
var COL_WIDTH = 101,
    ROW_HEIGHT = 85,
    ROW_OFFSET = 50,
    TEXTSPEED = 400,
    ENEMY_SPEED_DEFAULT = 30,
    enemySpeedMultiplier = ENEMY_SPEED_DEFAULT,
    numOfEnemies = 3,
    gemScore = 0,
    gameState = "menu"; //"menu", "start", "end";

//initial dummy score data
var highScoreData = {
    "scores" : [
        {
            name: "Abe",
            score: 5
        },
        {
            name: "Bob",
            score: 3
        },
        {
            name: "Abe",
            score: 2
        },
        {
            name: "Kat",
            score: 1
        },
        {
            name: "Bob",
            score: 0
        }
    ]
};

/**
  * @class Enemy Class
  * @desc enemies will run cross the screen at different rows, in hopes of
    * colliding with the player. Enemies will spawn at random rows with random
    * velocity, and will be recycled once position is off screen. Once the player
    * has been hit, enemies will not spawn again until all enemies are off screen,
    * making sure that player won't be hit multiple times by enemies in the same
    * row. Player has to press "space bar" to continue the game.
  * Examples: enemy.reset(), enemy.waitOffScreen(), enemy.StopWaiting()
*/
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -COL_WIDTH;
    this.y = Math.floor(Math.random()*5)*ROW_HEIGHT + ROW_OFFSET;
    this.velocity = Math.floor(Math.random()*3 + 3)*enemySpeedMultiplier;
    this.onScreen = true;
    this.isWaiting = false;

    //public getter
    this.getX = function(){return this.x;};
    this.getY = function(){return this.y;};
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt*this.velocity;
    //enemies will continue to recycle themselves within
    //the level if player hasn't been hit. If player's
    //hit, then the game will pause the enemies
    if(this.x > COL_WIDTH*5 && player.isHit === false){
        //console.log("object out of screen");
        this.reset();
    }
    else if(this.x > COL_WIDTH*5 && player.isHit === true){
        //console.log("object out of screen");
        this.waitOffScreen();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//When enemy goes off screen, prep it to be reused
Enemy.prototype.reset = function() {

    this.x = -COL_WIDTH;
    this.y = Math.floor(Math.random()*5)*ROW_HEIGHT + ROW_OFFSET;
    this.velocity = Math.floor(Math.random()*3 + 3)*enemySpeedMultiplier;
    this.isWaiting = false;
};

//enemies wait off screen in between actual gameplay
Enemy.prototype.waitOffScreen = function() {
    this.x = -COL_WIDTH;
    this.y = Math.floor(Math.random()*5)*ROW_HEIGHT + ROW_OFFSET;
    this.velocity = 0;
    this.isWaiting = true;
};

Enemy.prototype.stopWaiting = function() {
    this.velocity = Math.floor(Math.random()*3 + 3)*enemySpeedMultiplier;
    this.isWaiting = false;
};


/**
  * @class Player class
  * @desc you can control player by moving it across the canvas and
  * interact with the environment in various ways (collide with enemy/gem)
  * @param index - int used to initialize player mascot image
*/
var Player = function(index) {

    var allChar = [
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];

    this.sprite = allChar[index];
    this.x = COL_WIDTH*2;
    this.y = ROW_OFFSET + ROW_HEIGHT*4;
    this.isHit = false;
    this.lives = 3; //player has 3 lives to begin with
    this.lifeSprite = 'images/Heart.png';

    this.getX = function(){ return this.x;};
    this.getY = function(){ return this.y;};
    this.setX = function(x){this.x = x;};
    this.setY = function(y){this.y = y;};
};


Player.prototype.render = function(ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    //draw a filler rect, since there's some empty spot at the
    //top of the canvas, so when heart is no longer drawn
    //there won't be left-over image from before
    ctx.fillStyle = "#82CAFA";
    ctx.fillRect(0,0,ctx.canvas.clientWidth, ROW_OFFSET+3);

    //draw player HP
    for(var i=0; i<this.lives; i++){
        ctx.drawImage(Resources.get(this.lifeSprite),COL_WIDTH*i,-52);
    }

    //draw transparent rect when player is hit and has to wait for ladybugs to clear screen
    if(this.isHit){
        ctx.fillStyle = "#726E6D";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 1.0;
    }

};

Player.prototype.handleInput = function(kb) {

    //console.log(kb);

    //Only when all the enemies go off screen do we allow
    //the player to reactivate game by pressing space bar
    var isEnemyWaiting = 0;
    allEnemies.forEach(function(enemy){
        if(enemy.velocity === 0)
            isEnemyWaiting++;
    });
    if(isEnemyWaiting === allEnemies.length){
        if (kb === 'space' || kb === 'enter'){
            allEnemies.forEach(function(enemy){
                enemy.stopWaiting();
                player.isHit = false;
            });

            //if player health is already 0, re-initialize the game to menu
            if(this.lives === 0){
                gameState = "menu";
            }
        }

    }
    else {
            //once the player is hit we don't let the player move
            if(!player.isHit){

                if (kb === 'up'){
                    if (this.y > ROW_OFFSET){
                        this.y -= ROW_HEIGHT;
                    }
                    else {
                        this.y = ROW_OFFSET + ROW_HEIGHT*4;
                    }
                }
                else if(kb === 'down'){
                    if(this.y < ROW_OFFSET + ROW_HEIGHT*4){
                        this.y += ROW_HEIGHT;
                    }else {
                        this.y = ROW_OFFSET;
                    }
                }
                else if(kb === 'left'){
                    if(this.x > 0){
                        this.x -= COL_WIDTH;
                    }else {
                        this.x = COL_WIDTH*4;
                    }
                }
                else if(kb === 'right'){
                    if(this.x < COL_WIDTH*4){
                        this.x += COL_WIDTH;
                    }else {
                        this.x = 0;
                    }
                }
                //console.log(this.x, this.y);
            }
        }
};

//This function is called when player gets hit, resets to original position
Player.prototype.reset = function(){
    player.setX(COL_WIDTH*2);
    player.setY(ROW_OFFSET + ROW_HEIGHT*4);

};

/**
  * @class Gem Class
  * @desc increments game score when collided by player position
*/
var Gem = function(){
    //Initialize gem to use 1 of 3 colors randomly
    var gemColors = ["Blue", "Green", "Orange"],
        tempX = Math.floor(Math.random()*5)*COL_WIDTH,
        tempY = Math.floor(Math.random()*5)*ROW_HEIGHT + ROW_OFFSET;
    /*
      Make sure new gem doesn't spawn on top of player NOR spawn at
      default player spawn point
    */

    while((tempX === player.getX() && tempY === player.getY()) ||
            (tempX === COL_WIDTH*2 && tempY === ROW_OFFSET + ROW_HEIGHT*4)){
        tempX = Math.floor(Math.random()*5)*COL_WIDTH;
        tempY = Math.floor(Math.random()*5)*ROW_HEIGHT + ROW_OFFSET;
    }
    this.x = tempX;
    this.y = tempY;
    this.color = gemColors[Math.floor(Math.random()*3)];
    this.sprite = 'images/Gem' + ' ' + this.color + ".png";

    //console.log("gem:" + this.x, this.y);

    this.getX = function(){ return this.x;};
    this.getY = function(){ return this.y;};
    this.setX = function(x){this.x = x;};
    this.setY = function(y){this.y = y;};

};

Gem.prototype.render = function(ctx){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update = function(){

};

/**
  * @class GameText Class
  * @desc shows various text across canvas with different animation
  * @usage use GameText.begin() to start animating
*/
var GameText = function(text){

    this.text = text;
    if(text === "Player Hit!"){
        this.x = -COL_WIDTH*6;
        this.y = ROW_OFFSET+ROW_HEIGHT*5;
        this.velocity = 0;
    }else if(text === "Game Over"){
        this.x = COL_WIDTH-20;
        this.y = - ROW_OFFSET - ROW_HEIGHT;
        this.velocity = 0;
    }
    else if(text === "Gem Madness"){
        this.x = 40;
        this.y = ROW_OFFSET + ROW_HEIGHT*3;
        this.velocity = 0;
    }
    else {
        this.x = 0;
        this.y = 0;
        this.velocity =0;
    }

};

GameText.prototype.render = function(ctx){
    if(this.text === "Player Hit!"){
        ctx.save();
        ctx.rotate(-Math.PI/6);
        ctx.font = "75px serif";
        ctx.fillStyle = "yellow";
        ctx.fillText(this.text, this.x , this.y );
        ctx.strokeStyle = "black";
        ctx.strokeText(this.text, this.x , this.y );
        ctx.restore();
    }else if(this.text === "Game Over"){
        ctx.save();
        ctx.font = "75px serif";
        ctx.fillStyle = "red";
        ctx.fillText(this.text, this.x , this.y );
        ctx.strokeStyle = "red";
        ctx.strokeText(this.text, this.x , this.y );
        ctx.restore();
    }else if(this.text === "Gem Madness"){
        ctx.save();
        ctx.font = "75px serif";
        ctx.fillStyle = "orange";
        ctx.fillText(this.text, this.x , this.y );
        ctx.strokeStyle = "black";
        ctx.strokeText(this.text, this.x , this.y );
        ctx.restore();
    }
};

GameText.prototype.update = function(dt){
    if(this.text === "Player Hit!"){
        this.x += dt*this.velocity;
        if(this.x >= COL_WIDTH*5 && this.y >= ROW_OFFSET+ ROW_HEIGHT*5){
            this.reset();
        }
    }else if(this.text === "Game Over"){
        this.y += dt*this.velocity;
        if(this.y >= ROW_OFFSET + ROW_HEIGHT*3){
            this.velocity = 0;
        }
    }
};

GameText.prototype.reset = function(){
    this.velocity = 0;
    this.x = -COL_WIDTH*6;
    this.y = ROW_OFFSET+ROW_HEIGHT*5;
};

GameText.prototype.begin = function(){
    this.velocity = TEXTSPEED;
};


/**
  * @class MenuSelector class
  * @desc MenuSelector allows the player to navigate "left" and "right" to choose
    their playable character.
*/
var MenuSelector = function(){

    this.sprite = 'images/Selector.png';
    this.x = COL_WIDTH*2;
    this.y = ROW_OFFSET + ROW_HEIGHT*4;

    this.getX = function(){return this.x;};
    this.getY = function(){return this.y;};
    this.setX = function(x){this.x = x;};
    this.setY = function(y){this.y = y;};

};

MenuSelector.prototype.render = function(ctx){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

MenuSelector.prototype.update = function(){

};

MenuSelector.prototype.handleInput = function(kb){
    if(kb === "left"){
        if(this.x >= COL_WIDTH){
            this.x -= COL_WIDTH;
        }
    }else if(kb === "right"){
        if(this.x < COL_WIDTH*4){
            this.x += COL_WIDTH;
        }
    }//Initialize main game level objects
    else if(kb === "space" || kb === "enter"){
        gameState = "start";
        //objects
        player = new Player(Math.floor(this.x/COL_WIDTH));
        gem = new Gem();
        hitText = new GameText("Player Hit!");
        gameOverText = new GameText("Game Over");
        allEnemies = [];
        for(var i=0; i<numOfEnemies; i++){
            allEnemies.push(new Enemy());
        }
    }

};



// Instantiate game object by going into menu first!
var menuSelector = new MenuSelector();
var gameTitleText = new GameText("Gem Madness");
//These variables will be initailized as objects when game starts
var player;
var gem;
var allEnemies = [];
var hitText;
var gameOverText;





/**
  *Additional helper functions
*/



/**
  * @desc listens for key presses and sends the keys to various listeners
     depending on gameState
    @param e - triggered keyboard press 'keyup'
    @return <none>
*/
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var key = allowedKeys[e.keyCode];
    if(key !== undefined){
        //prevent default action so window doesn't scroll when it's small, which
        //distracts user from playing the game
        e.preventDefault();
        if(gameState === "menu"){
            menuSelector.handleInput(key);
        }else if(gameState === "start"){
            player.handleInput(key);
        }else if(gameState === "end"){
            if(key === "space" || key === "enter"){
                gameState = "menu";
            }
        }
    }

});


/**
  * @desc checks player radius vs Enemy radius for any overlap, return true if overlapped(true)
    @param <none>
    @return bool - player hit true/false
*/
function checkCollisions(){
    var enemyWidthMin,
        enemyWidthMax,
        playerWidthMin,
        playerWidthMax;

    var isHit = false;

    allEnemies.forEach(function(enemy){


        if(enemy.getY() === player.getY()){  //check if enemy&player are in the same row
            enemyWidthMin = enemy.getX() - COL_WIDTH/3;
            enemyWidthMax = enemy.getX() + COL_WIDTH/3;
            playerWidthMin = player.getX() - COL_WIDTH/3;
            playerWidthMax = player.getX() + COL_WIDTH/3;
            //check if player's width margin is within enemy's width margin
            if((playerWidthMin > enemyWidthMin && playerWidthMin < enemyWidthMax) ||
                (playerWidthMax > enemyWidthMin && playerWidthMax < enemyWidthMax)){
                    //collision found! Drop user back to the starting location
                    if(!player.isHit){
                            player.isHit = true;
                            hitText.begin();
                            isHit = true;
                            player.reset();
                            player.lives--;
                            if(player.lives === 0){
                                gameOverText.begin();
                            }
                        }
                }
        }
    });
    return isHit;
}

/**
  * @desc let Player score gem points when colliding with it
    @param <none>
    @return bool - gem hit true/false
*/
function checkGemCollisions(){
    var isHit = false;
    if(gem.getY() === player.getY() && gem.getX() === player.getX()){
        isHit = true;
        gem = new Gem();
        updateGameStats();
    }
    return isHit;
}


/**
  * @desc increase game score, as well as adjust game difficulty
     depending on the current score
    @param <none>
    @return <none>
*/
function updateGameStats(){
    gemScore++;
    console.log("points:"+ gemScore);
    if(gemScore < 5){
        console.log("easy mode");
        enemySpeedMultiplier += 5;
    }else if(gemScore >= 5 && gemScore < 10){
        console.log("normal mode");
        enemySpeedMultiplier += 2;
    }else if(gemScore >=10 && gemScore < 15){
        console.log("hard mode");
        enemySpeedMultiplier += 2;
        if(gemScore === 10){
            allEnemies.push(new Enemy());
        }
    }else if(gemScore >=15 && gemScore < 20){
        if(gemScore === 15){
            allEnemies.push(new Enemy());
        }
    }
}

/**
  * @desc transition the gameState from "start" to "menu",
    initializes gameplay variables
    @param <none>
    @return <none>
*/
function gameReset(){
    menuSelector = new MenuSelector();
    gameTitleText = new GameText("Gem Madness");
    player = undefined;
    gem = undefined;
    allEnemies = [];
    hitText = undefined;
    gameOverText = undefined;
    enemySpeedMultiplier = ENEMY_SPEED_DEFAULT;
    TEXTSPEED = 400;
    numOfEnemies = 3;
    gemScore = 0;

}
