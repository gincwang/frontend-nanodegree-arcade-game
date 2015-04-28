var colWidth = 101,
    rowHeight = 85,
    rowOffset = 50;
    EnemySpeedMultiplier = 100;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = Math.floor(Math.random()*5)*rowHeight + rowOffset;
    this.velocity = Math.floor(Math.random()*4 + 1)*EnemySpeedMultiplier;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt*this.velocity;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

    this.sprite = 'images/char-boy.png';
    this.x = 2 * 101;
    this.y = 50 + 85 * 4;

}


Player.prototype.update = function(dt) {


}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(kb) {

    console.log(kb);

    if (kb === 'up' && this.y > rowOffset)
    { this.y -= rowHeight;}
    else if(kb === 'down' && this.y < rowOffset + rowHeight*4)
    { this.y += rowHeight;}
    else if(kb === 'left' && this.x > 0)
    { this.x -= colWidth;}
    else if(kb === 'right' && this.x < colWidth*4)
    { this.x += colWidth;}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
allEnemies.push(new Enemy());

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
