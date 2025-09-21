import { Tank } from './Tank.js';
import { Bullet } from './Bullet.js';
import { Enemy } from './Enemy.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game entities
        this.tank = new Tank(this.width / 2, this.height / 2);
        this.bullets = [];
        this.enemies = [];
        
        // Game state
        this.score = 0;
        this.gameRunning = true;
        this.lastEnemySpawn = 0;
        this.enemySpawnInterval = 2000; // 2 seconds
        
        // Mouse position
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop();
        
        console.log('Tank Battle Game initialized');
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameRunning) {
                this.fireBullet();
            }
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.tank.keys.up = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.tank.keys.down = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.tank.keys.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.tank.keys.right = true;
                break;
        }
        console.log('Key pressed:', e.code);
    }
    
    handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.tank.keys.up = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.tank.keys.down = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.tank.keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.tank.keys.right = false;
                break;
        }
    }
    
    fireBullet() {
        const barrelTip = this.tank.getBarrelTip();
        const bullet = new Bullet(barrelTip.x, barrelTip.y, this.tank.barrelAngle);
        this.bullets.push(bullet);
        console.log('Bullet fired from:', barrelTip.x, barrelTip.y, 'angle:', this.tank.barrelAngle);
    }
    
    spawnEnemy() {
        const enemy = Enemy.spawnFromEdge(this.width, this.height, this.tank.x, this.tank.y);
        this.enemies.push(enemy);
        console.log('Enemy spawned at:', enemy.x, enemy.y);
    }
    
    update(currentTime) {
        if (!this.gameRunning) return;
        
        // Update tank
        this.tank.update(this.mouseX, this.mouseY, this.width, this.height);
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            // Remove inactive bullets or bullets out of bounds
            if (!bullet.active || bullet.isOutOfBounds(this.width, this.height)) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // Check bullet-enemy collisions
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (enemy.active && bullet.collidesWith(enemy)) {
                    // Enemy hit
                    bullet.active = false;
                    if (enemy.takeDamage(1)) {
                        this.score += 10;
                        this.updateScore();
                        console.log('Enemy destroyed! Score:', this.score);
                    }
                    break;
                }
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy.active) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            enemy.updateDirection(this.tank.x, this.tank.y);
            enemy.update();
            
            // Check tank-enemy collision
            if (this.tank.collidesWith(enemy)) {
                if (this.tank.takeDamage(20)) {
                    this.gameOver();
                } else {
                    enemy.active = false; // Remove enemy after damage
                    this.updateHealth();
                    console.log('Tank hit! Health:', this.tank.health);
                }
            }
        }
        
        // Spawn enemies
        if (currentTime - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawn = currentTime;
            
            // Gradually increase spawn rate
            if (this.enemySpawnInterval > 500) {
                this.enemySpawnInterval -= 25;
            }
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grid pattern for background
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        
        // Draw game entities
        this.tank.draw(this.ctx);
        
        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });
        
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
        
        // Draw crosshair at mouse position
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX - 10, this.mouseY);
        this.ctx.lineTo(this.mouseX + 10, this.mouseY);
        this.ctx.moveTo(this.mouseX, this.mouseY - 10);
        this.ctx.lineTo(this.mouseX, this.mouseY + 10);
        this.ctx.stroke();
    }
    
    gameLoop(currentTime = 0) {
        this.update(currentTime);
        this.render();
        
        if (this.gameRunning) {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
    
    updateScore() {
        document.getElementById('scoreValue').textContent = this.score;
    }
    
    updateHealth() {
        document.getElementById('healthValue').textContent = this.tank.health;
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('game-over').classList.remove('hidden');
        console.log('Game Over! Final score:', this.score);
    }
    
    restart() {
        // Reset game state
        this.tank = new Tank(this.width / 2, this.height / 2);
        this.bullets = [];
        this.enemies = [];
        this.score = 0;
        this.lastEnemySpawn = 0;
        this.enemySpawnInterval = 2000;
        this.gameRunning = true;
        
        // Update UI
        this.updateScore();
        this.updateHealth();
        document.getElementById('game-over').classList.add('hidden');
        
        // Restart game loop
        this.gameLoop();
        console.log('Game restarted');
    }
}
