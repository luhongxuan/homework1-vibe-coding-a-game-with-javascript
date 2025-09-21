export class Enemy {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.radius = 15;
        this.speed = 1.5;
        this.health = 1;
        this.active = true;
        this.color = '#e74c3c';
        
        // Calculate initial direction towards player
        this.updateDirection(targetX, targetY);
    }
    
    updateDirection(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
        
        // Calculate direction vector towards target
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        }
    }
    
    update() {
        if (!this.active) return;
        
        // Move towards target
        this.x += this.vx;
        this.y += this.vy;
        
        // Optional: Add some randomness to movement
        if (Math.random() < 0.02) {
            this.x += (Math.random() - 0.5) * 2;
            this.y += (Math.random() - 0.5) * 2;
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        
        // Draw enemy body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw enemy outline
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw simple "angry" face
        ctx.fillStyle = '#fff';
        // Eyes
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 3, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 4, 0, Math.PI);
        ctx.stroke();
        
        ctx.restore();
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
            return true; // Enemy destroyed
        }
        return false;
    }
    
    // Static method to spawn enemy from random edge
    static spawnFromEdge(canvasWidth, canvasHeight, targetX, targetY) {
        const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;
        
        switch(edge) {
            case 0: // Top edge
                x = Math.random() * canvasWidth;
                y = -20;
                break;
            case 1: // Right edge
                x = canvasWidth + 20;
                y = Math.random() * canvasHeight;
                break;
            case 2: // Bottom edge
                x = Math.random() * canvasWidth;
                y = canvasHeight + 20;
                break;
            case 3: // Left edge
                x = -20;
                y = Math.random() * canvasHeight;
                break;
        }
        
        return new Enemy(x, y, targetX, targetY);
    }
}
