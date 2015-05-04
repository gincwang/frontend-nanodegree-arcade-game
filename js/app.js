var colWidth = 101,
    rowHeight = 85,
    rowOffset = 50,
    EnemySpeedMultiplier = 100,
    numOfEnemies = 3;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -colWidth;
    this.y = Math.floor(Math.random()*5)*rowHeight + rowOffset;
    this.velocity = Math.floor(Math.random()*4 + 1)*EnemySpeedMultiplier;
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


Enemy.prototype.reset = function() {

    this.x = -colWidth;
    this.y = Math.floor(Math.random()*5)*rowHeight + rowOffset;
    this.velocity = Math.floor(Math.random()*4 + 1)*EnemySpeedMultiplier;
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
    this.velocity = Math.floor(Math.random()*4 + 1)*EnemySpeedMultiplier;
    this.isWaiting = false;
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

    this.sprite = 'images/char-boy.png';
    this.x = colWidth*2;
    this.y = rowOffset + rowHeight*4;
    this.isHit = false;

    this.getX = function(){ return this.x};
    this.getY = function(){ return this.y};
    this.setX = function(x){this.x = x};
    this.setY = function(y){this.y = y};
}


Player.prototype.update = function(dt) {

}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(kb) {

    console.log(kb);

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
        }

    }
    else {
            //once the player is hit we don't let the player move
            if(!player.isHit){

                if (kb === 'up' && this.y > rowOffset-rowHeight)
                { this.y -= rowHeight;}
                else if(kb === 'down' && this.y < rowOffset + rowHeight*4)
                { this.y += rowHeight;}
                else if(kb === 'left' && this.x > 0)
                { this.x -= colWidth;}
                else if(kb === 'right' && this.x < colWidth*4)
                { this.x += colWidth;}
                console.log(this.y, this.x);
            }
        }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for(var i=0; i<numOfEnemies; i++){
    allEnemies.push(new Enemy());
}


var player = new Player();

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

    player.handleInput(allowedKeys[e.keyCode]);
});

//This function is called after Enemy has updated its position, and
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
                    //collision found! Drop user back to the bottom row
                    player.isHit = true;
                    player.setY(rowOffset + rowHeight*4);
                    isHit = true;
                }

        }

    })
    return isHit;
}
