import { Game } from './game/Game.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const restartBtn = document.getElementById('restartBtn');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    console.log('Initializing Tank Battle Game...');
    
    // Create and start the game
    let game = new Game(canvas);
    
    // Handle restart button
    restartBtn.addEventListener('click', () => {
        game.restart();
    });
    
    // Handle window resize to keep canvas centered
    window.addEventListener('resize', () => {
        // Canvas size is fixed, but we might want to handle this in the future
    });
    
    console.log('Game setup complete!');
});
