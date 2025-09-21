Please create a simple "Tank Battle" game using JavaScript and HTML5 Canvas with the following requirements:

1. Screen Setup:
   - Fixed canvas size (e.g., 800x600).
   - A player-controlled tank should appear on the screen.
   - The tank design should include:
     - A circular body (base),
     - Rectangular tracks,
     - A straight barrel.

2. Tank Controls:
   - The tank moves with arrow keys (↑ ↓ ← →).
   - The tank should always rotate to face the mouse cursor.
   - When the left mouse button is clicked, the tank fires a bullet from the barrel.

3. Bullet System:
   - Bullets spawn at the tip of the barrel.
   - Bullets travel forward in the direction of the barrel.
   - Each bullet should disappear after traveling a fixed distance (e.g., 300 pixels).
   - Bullets should also disappear if they hit an enemy, and the enemy is destroyed.

4. Enemy System:
   - Enemies spawn randomly from the four edges of the screen (top, bottom, left, right).
   - Enemies move toward the player’s tank.
   - Enemies can be represented as simple circles.

5. Additional Requirements:
   - Keep the code clean and modular (use Tank, Bullet, Enemy classes).
   - Use requestAnimationFrame for smooth animation.
   - Structure the game with a main loop that updates positions, checks collisions, and renders everything on the canvas.
