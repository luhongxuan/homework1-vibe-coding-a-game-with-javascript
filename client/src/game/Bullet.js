export class Bullet {
    constructor(x, y, angle, speed = 8) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.radius = 3;
        this.maxDistance = 300;
        this.traveledDistance = 0;
        this.active = true;
        
        // Calculate velocity components
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    
    update() {
        if (!this.active) return;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Update traveled distance
        this.traveledDistance += this.speed;
        
        // Deactivate if traveled max distance
        if (this.traveledDistance >= this.maxDistance) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        
        // Draw bullet trail
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const trailLength = 10;
        const startX = this.x - Math.cos(this.angle) * trailLength;
        const startY = this.y - Math.sin(this.angle) * trailLength;
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        
        // Draw bullet
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bullet outline
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Check if bullet is outside canvas bounds
    isOutOfBounds(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || 
               this.y < 0 || this.y > canvasHeight;
    }
    
    // Check collision with enemy
    collidesWith(enemy) {
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.radius + enemy.radius);
    }
}
