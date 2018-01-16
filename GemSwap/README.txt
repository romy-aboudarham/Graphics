10/9/17
Homework 1: 2D Game
Romy Aboudarham 

I created a small 2D game inspired by Gem Swap. On a grid of 10x10, there are 100 gems (2D shapes of different vertex counts and colors) of the following 5 shapes: heart, Star, Circle, Square, Web(?). The following features have been included in the game:

1. Stellar - one type of gem should be the Star. Place one vertex in the middle, and ten around. The ten triangles making up the shape are all spanned by the central vertex and a pair of neighbor vertices on the perimeter. Think in polar coordinates to calculate the exact vertex locations.

2. Lovely - one type of gem should be the Heart. Place one vertex in the middle, and several along the perimeter. All triangles making up the shape are spanned by the central vertex and a pair of neighbor vertices on the perimeter. Obtain the perimeter vertices by evaluating a heart-curve formula (http://mathworld.wolfram.com/HeartCurve.html) for several values of t in [0, 1].

3. Heartbeat - one type of gem (perhaps the Heart) should pulsate, changing its color periodically. Pass the time (elapsed since the start of the game) to the fragment shader as a uniform, and use a periodic function of it to influence the color.

4. Gyro (applied to Star Gem) - one type of gem should rotate continuously. Change its orientation in every frame. 

5. Swap - if the mouse button is pressed with the mouse pointer over a grid cell, and released over a neighboring cell, the gems in the two cells are swapped. 

6. Legal (requires Swap) - the swap only happens if it causes three or more identical gems to line up in a row or column.

7. Sticky (requires Swap) - while the mouse button is held down, the gem about to be swapped moves with the mouse pointer (it is dragged).

8. Bomb - when a cell is clicked with key 'B' held down, the gem in the cell disappears. You may limit the number of times this can be used.

9. Quake (executed at most 3 times) - when key 'Q' is held down, the visible window (i.e. the 2D camera position) shakes violently (you may add a high-freq sin function of time to the position). During the quake, in every frame, all gems stand a 0.1% chance of disappearing. You may limit the number of times (or frames) this can be used.

10. Dramatic exit (requires Three-in-a-line or Bomb or Quake) - when gems disappear, they do so by quickly, but gradually shrinking to zero size, while rotating.

11. Skyfall (requires Three-in-a-line or Bomb or Quake) - when gems disappear, gems above them fall in their places. Random gems fall in to places in the upmost rows.

12. Feather fall (requires Skyfall) - when gems fall, they do so with continuous motion, not with an abrupt jump.

13. Turn the tables - when key 'A' or 'D' is held down, rotate the 2D camera in counterclockwise or clockwise direction, respectively.
