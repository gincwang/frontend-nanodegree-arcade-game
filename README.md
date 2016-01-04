Project 3 - frontend-nanodegree-arcade-game
===============================

This is a classic Frogger-style game with a twist, called Gem Madness.
Instead of scoring by crossing the road and reaching the river, the player has to
score through collecting gems that will spawn all over the road, while avoiding
the ever-busier traffic of the in-coming ladybugs.

Play this game at:
http://gincwang.github.io/frontend-nanodegree-arcade-game

Concepts explored in this game: Object Oriented Design, game loop, HTML Canvas, persistent data through localStorage

##Menu Selection
-----------------

Gem Madness begins by showing you a list of playable character. You can use your
directional keys: '<-' and '->' to navigate, and once you've settled on your
favorite character, press 'space bar/enter' to start the game!

##How To Play
-----------

Your goal is to collect as many gems as possible while avoiding the ladybugs.

you always spawns at the bottom-center position - This is also the position
you return to when you get hit by the ladybugs, and you are given 3 lives at the start.

You have the ability to navigate the game level with your directional keys:
'left', 'right', 'up', 'down'.

##When you are hit by the ladybugs
    - you will lose one life point(indicated by the top left corner)
    - you will be sent back to the initial location
    - you will lose control of your navigation, and the game is essentially
      paused until all ladybugs have disappearred off-screen. This is to ensure
      you won't get immediately hit by the ladybug again when the ladybug happens
      to be at where you reset to, and also give you(the player) a chance to take
      a break and strategize how to get that next gem!
    - To continue the game, simply press the "space bar/enter" and the game will run
      from where it was left off.

##When you score a gem
    - The game score indicator on the top will increase
    - the game will gradually increase in difficulty as your score increases,
      e.g. more enemies will spawn/enemies will move faster

##When you run out of life points
    - game over :(
    - press "space bar/enter" will take you back to the menu selection, where you can
      initialize another Gem Madness game!

##High Scores
    - your scores are recorded and stored in your browser's localStorage, so the next time you come back you can try to beat your old best score!

Good Luck and Have Fun!!


p.s. my personal best score is 32.

================================================================================

Students should use this rubric: https://www.udacity.com/course/viewer#!/c-nd001/l-2696458597/m-2687128535

for self-checking their submission.
