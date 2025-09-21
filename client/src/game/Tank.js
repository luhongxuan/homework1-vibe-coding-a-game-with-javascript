export class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.bodyRadius = 18;
        this.trackWidth = 8;
        this.barrelLength = 35;
        this.barrelWidth = 6;
        
        // Movement and rotation
        this.speed = 3;
        this.angle = 0; // Tank body angle
        this.barrelAngle = 0; // Barrel angle (follows mouse)
        
        // Health
        this.maxHealth = 100;
        this.health = this.maxHealth;
        
        // Input state
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }
    
    update(mouseX, mouseY, canvasWidth, canvasHeight) {
        // Update barrel angle to point towards mouse
        this.barrelAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
        
        // Handle movement
        let dx = 0;
        let dy = 0;
        
        if (this.keys.up) dy -= this.speed;
        if (this.keys.down) dy += this.speed;
        if (this.keys.left) dx -= this.speed;
        if (this.keys.right) dx += this.speed;
        
        // Apply movement with boundary checking
        this.x += dx;
        this.y += dy;
        
        // Keep tank within canvas bounds
        const margin = this.bodyRadius;
        this.x = Math.max(margin, Math.min(canvasWidth - margin, this.x));
        this.y = Math.max(margin, Math.min(canvasHeight - margin, this.y));
        
        // Update tank body angle based on movement direction
        if (dx !== 0 || dy !== 0) {
            this.angle = Math.atan2(dy, dx);
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw tank tracks
        ctx.fillStyle = '#2c3e50';
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Left track
        ctx.fillRect(-this.width/2, -this.height/2 - this.trackWidth/2, this.width, this.trackWidth);
        // Right track  
        ctx.fillRect(-this.width/2, this.height/2 - this.trackWidth/2, this.width, this.trackWidth);
        
        ctx.restore();
        
        // Draw tank body (circle)
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.bodyRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tank body outline
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw barrel
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.barrelAngle);
        
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, -this.barrelWidth/2, this.barrelLength, this.barrelWidth);
        
        // Barrel tip
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(this.barrelLength - 3, -this.barrelWidth/2, 3, this.barrelWidth);
        
        ctx.restore();
        
        // Draw health bar if damaged
        if (this.health < this.maxHealth) {
            const barWidth = 40;
            const barHeight = 6;
            const barX = this.x - barWidth/2;
            const barY = this.y - this.bodyRadius - 15;
            
            // Background
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Health
            ctx.fillStyle = '#27ae60';
            const healthWidth = (this.health / this.maxHealth) * barWidth;
            ctx.fillRect(barX, barY, healthWidth, barHeight);
            
            // Border
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
        
        ctx.restore();
    }
    
    getBarrelTip() {
        return {
            x: this.x + Math.cos(this.barrelAngle) * this.barrelLength,
            y: this.y + Math.sin(this.barrelAngle) * this.barrelLength
        };
    }
    
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    // Check collision with enemy
    collidesWith(enemy) {
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.bodyRadius + enemy.radius);
    }
}
