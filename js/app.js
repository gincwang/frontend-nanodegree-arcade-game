//Game variables
var colWidth = 101,
    rowHeight = 85,
    rowOffset = 50,
    enemySpeedMultiplier = 30,
    textSpeed = 400,
    numOfEnemies = 3,
    gemScore = 0,
    gameState = "menu"; //"menu", "start", "end";


////////////////////////
// Enemy class //////////////////////
// Enemies our player must avoid ////
/////////////////////////////////////
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -colWidth;
    this.y = Math.floor(Math.random()*5)*rowHeight + rowOffset;
    this.velocity = Math.floor(Math.random()*3 + 3)*enemySpeedMultiplier;
    this.onScreen = true;
    this.isWaiting = false;

    //public getter
    this.getX = function(){return this.x};
    this.getY = function(){return this.y};
}

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
    if(this.x > colWidth*5 && player.isHit === false){
        //console.log("object out of screen");
        this.reset();
    }
    else if(this.x > colWidth*5 && player.isHit === true){
        //console.log("object out of screen");
        this.waitOffScreen();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//When enemy goes off screen, prep it to be reused
Enemy.prototype.reset = function() {

    this.x = -colWidth;
    this.y = Math.floor(Math.random()*5)*rowHeight + rowOffset;
    this.velocity = Math.floor(Math.random()*3 + 3)*enemySpeedMultiplier;
    this.isWaiting = false;
}

//enemies wait off screen in between actual gameplay
Enemy.prototype.waitOffScreen = function() {
    this.x = -colWidth;
    this.y = Math.floor(Math.random()*5)*rowHeight + rowOffset;
    this.velocity = 0;
    this.isWaiting = true;
}

Enemy.prototype.stopWaiting = function() {
    this.velocity = Math.floor(Math.random()*3 + 3)*enemySpeedMultiplier;
    this.isWaiting = false;
}


////////////////////////
//// Player class ////////////////////////////////////////////////////
//// you can control player by moving it across the canvas and ///////
//// interact with the environment in various ways ///////////////////
//////////////////////////////////////////////////////////////////////
var Player = function(index) {

    var allChar = [
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];

    this.sprite = allChar[index];
    this.x = colWidth*2;
    this.y = rowOffset + rowHeight*4;
    this.isHit = false;
    this.lives = 3; //player has 3 lives to begin with
    this.lifeSprite = 'images/Heart.png'

    this.getX = function(){ return this.x};
    this.getY = function(){ return this.y};
    this.setX = function(x){this.x = x};
    this.setY = function(y){this.y = y};
}


Player.prototype.update = function(dt) {
    //hmmmm..
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    //draw a filler white rect, since there's some empty spot at the
    //top of the canvas, so when heart is no longer drawn
    //there won't be left-over image from before
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,ctx.canvas.clientWidth, rowOffset);


    for(i=0; i<this.lives; i++){
        ctx.drawImage(Resources.get(this.lifeSprite),colWidth*i,-30);
    }
}

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
        if (kb === 'space'){
            allEnemies.forEach(function(enemy){
                enemy.stopWaiting();
                player.isHit = false;
            })

            //if player health is already 0, re-initialize the game to menu
            if(this.lives === 0){
                gameState = "menu";
                gameReset();
            }
        }

    }
    else {
            //once the player is hit we don't let the player move
            if(!player.isHit){

                if (kb === 'up' && this.y > rowOffset)
                { this.y -= rowHeight;}
                else if(kb === 'down' && this.y < rowOffset + rowHeight*4)
                { this.y += rowHeight;}
                else if(kb === 'left' && this.x > 0)
                { this.x -= colWidth;}
                else if(kb === 'right' && this.x < colWidth*4)
                { this.x += colWidth;}
                //console.log(this.x, this.y);
            }
        }
}

//This function is called when player gets hit, resets to original position
Player.prototype.reset = function(){
    player.setX(colWidth*2);
    player.setY(rowOffset + rowHeight*4);

}

///////////////////
//// Gem Class ///////////////////////////////////////////
//// player can score Gems by walking on top of it ///////
//////////////////////////////////////////////////////////
var Gem = function(){

    var gemColors = ["Blue", "Green", "Orange"],
        tempX = Math.floor(Math.random()*5)*colWidth,
        tempY = Math.floor(Math.random()*5)*rowHeight + rowOffset;

    //Make sure new gem doesn't spawn on top of player NOR spawn at
    //default player spawn point
    while((tempX === player.getX() && tempY === player.getY()) ||
            (tempX === colWidth*2 && tempY === rowOffset + rowHeight*4)){
        tempX = Math.floor(Math.random()*5)*colWidth;
        tempY = Math.floor(Math.random()*5)*rowHeight + rowOffset;
    }
    this.x = tempX;
    this.y = tempY;
    this.color = gemColors[Math.floor(Math.random()*3)];
    this.sprite = 'images/Gem' + ' ' + this.color + ".png";

    console.log("gem:" + this.x, this.y);

    this.getX = function(){ return this.x};
    this.getY = function(){ return this.y};
    this.setX = function(x){this.x = x};
    this.setY = function(y){this.y = y};

}

Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gem.prototype.update = function(){

}

///////////////////////////
//// GameText class /////////////////////////////////////////////////
//// Shows various text across canvas with different animation //////
/////////////////////////////////////////////////////////////////////
var GameText = function(text){

    this.text = text;
    if(text === "Player Hit!"){
        this.x = -colWidth*6;
        this.y = rowOffset+rowHeight*5;
        this.velocity = 0;
    }else if(text === "Game Over"){
        this.x = colWidth-20;
        this.y = - rowOffset - rowHeight;
        this.velocity = 0;

    }else {
        this.x = 0;
        this.y = 0;
        this.velocity =0;
    }

}

GameText.prototype.render = function(){
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
        console.log("gg text: "+ this.x + " and " + this.y)
    }
}

GameText.prototype.update = function(dt){
    if(this.text === "Player Hit!"){
        this.x += dt*this.velocity;
        if(this.x >= colWidth*5 && this.y >= rowOffset+ rowHeight*5){
            this.reset();
        }
    }else if(this.text === "Game Over"){
        this.y += dt*this.velocity;
        if(this.y >= rowOffset + rowHeight*3){
            this.velocity = 0;
        }
    }
}

GameText.prototype.reset = function(){
    this.velocity = 0;
    this.x = -colWidth*6;
    this.y = rowOffset+rowHeight*5;
}

GameText.prototype.begin = function(){
    this.velocity = textSpeed;
}


/////////////////////////////
//// MenuSelector class //////////////////////////////////////////////////////
//MenuSelector displays the current selected playable character in the menu //
//////////////////////////////////////////////////////////////////////////////
var MenuSelector = function(){

    this.sprite = 'images/Selector.png';
    this.x = colWidth*2;
    this.y = rowOffset + rowHeight*4;

    this.getX = function(){return this.x;};
    this.getY = function(){return this.y;};
    this.setX = function(x){this.x = x;};
    this.setY = function(y){this.y = y;};

}

MenuSelector.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

MenuSelector.prototype.update = function(){

}

MenuSelector.prototype.handleInput = function(kb){
    console.log(kb);
    if(kb === "left"){
        if(this.x >= colWidth){
            this.x -= colWidth;
        }
    }else if(kb === "right"){
        if(this.x < colWidth*4){
            this.x += colWidth;
        }
    }//Initialize main game level objects
    else if(kb === "space"){
        gameState = "start";
        //objects
        player = new Player(Math.floor(this.x/colWidth));
        gem = new Gem();
        hitText = new GameText("Player Hit!");
        gameOverText = new GameText("Game Over");
        allEnemies = [];
        for(var i=0; i<numOfEnemies; i++){
            allEnemies.push(new Enemy());
        }
    }

}


// Instantiate game object by going into menu first!
var menuSelector = new MenuSelector();

//These variables will be initailized as objects when game starts
var player;
var gem;
var allEnemies = [];
var hitText;
var gameOverText;





///////Additional helper functions /////////


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(gameState === "menu"){
        menuSelector.handleInput(allowedKeys[e.keyCode]);
    }else if(gameState === "start"){
        player.handleInput(allowedKeys[e.keyCode]);
    }else if(gameState === "end"){
        if(allowedKeys[e.keyCode] === "space"){
            gameState = "menu";
        }
    }
});

//This function is called after Enemy and Player have updated their positions
//called within Player.prototype.update()
//Checks player radius vs Enemy radius for any overlap
function checkCollisions(){
    var enemyWidthMin,
        enemyWidthMax,
        playerWidthMin,
        playerWidthMax;

    var isHit = false;

    allEnemies.forEach(function(enemy){

        //check if enemy&player are in the same row
        if(enemy.getY() === player.getY()){
            enemyWidthMin = enemy.getX() - colWidth/3,
            enemyWidthMax = enemy.getX() + colWidth/3,
            playerWidthMin = player.getX() - colWidth/3,
            playerWidthMax = player.getX() + colWidth/3;
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
    })
    return isHit;
}

//This function will let Player score gem points when colliding with it
function checkGemCollisions(){
    var isHit = false;
    if(gem.getY() === player.getY() && gem.getX() === player.getX()){
        isHit = true;
        gem = new Gem();
        updateGameStats();
    }
    return isHit;
}

//This function will increase game score, as well as adjust
//game difficulty depending on the current score
function updateGameStats(){
    gemScore++;
    console.log("points:"+ gemScore);
    if(gemScore < 5){
        console.log("easy mode")
        enemySpeedMultiplier += 5;
    }else if(gemScore >= 5 && gemScore < 10){
        console.log("normal mode")
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


function gameReset(){
    menuSelector = new MenuSelector();
    player = undefined;
    gem = undefined;
    allEnemies = [];
    hitText = undefined;
    gameOverText = undefined;
    enemySpeedMultiplier = 30;
    textSpeed = 400;
    numOfEnemies = 3;
    gemScore = 0;

}
