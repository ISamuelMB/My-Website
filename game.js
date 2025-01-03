class SpaceShooter {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.gameOver = false;
        this.gameLoop = null;

        // Set canvas size based on container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Player properties
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            width: this.canvas.width * 0.06, // Relative size
            height: this.canvas.width * 0.06,
            speed: this.canvas.width * 0.006
        };

        // Game state
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        
        // Controls
        this.keys = {
            left: false,
            right: false,
            space: false
        };

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.keys.left = true;
            if (e.key === 'ArrowRight') this.keys.right = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.keys.space = true;
                this.shoot();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') this.keys.left = false;
            if (e.key === 'ArrowRight') this.keys.right = false;
            if (e.key === ' ') this.keys.space = false;
        });

        // Mobile controls
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = touch.clientX - rect.left - this.player.width / 2;
        });

        this.canvas.addEventListener('touchstart', () => {
            this.shoot();
        });

        // Start game button
        document.getElementById('startGame').addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
        this.score = 0;
        this.gameOver = false;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        document.getElementById('scoreValue').textContent = this.score;
        
        if (this.gameLoop) cancelAnimationFrame(this.gameLoop);
        this.update();
    }

    shoot() {
        if (!this.gameOver) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10,
                speed: 7
            });
            this.createParticles(this.player.x + this.player.width / 2, this.player.y, '#00F5A0');
        }
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x,
                y,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 4,
                speedY: (Math.random() - 0.5) * 4,
                color,
                life: 1
            });
        }
    }

    spawnEnemy() {
        if (Math.random() < 0.02) {
            this.enemies.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: 2 + Math.random() * 2
            });
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update player position
        if (this.keys.left) this.player.x -= this.player.speed;
        if (this.keys.right) this.player.x += this.player.speed;

        // Keep player in bounds
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));

        // Draw player
        this.ctx.fillStyle = '#6C63FF';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Update and draw bullets
        this.bullets.forEach((bullet, bulletIndex) => {
            bullet.y -= bullet.speed;
            this.ctx.fillStyle = '#00F5A0';
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

            // Remove bullets that are off screen
            if (bullet.y < 0) this.bullets.splice(bulletIndex, 1);
        });

        // Spawn and update enemies
        this.spawnEnemy();
        this.enemies.forEach((enemy, enemyIndex) => {
            enemy.y += enemy.speed;
            this.ctx.fillStyle = '#FF6B6B';
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

            // Check for collision with bullets
            this.bullets.forEach((bullet, bulletIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#FF6B6B');
                    this.enemies.splice(enemyIndex, 1);
                    this.bullets.splice(bulletIndex, 1);
                    this.score += 10;
                    document.getElementById('scoreValue').textContent = this.score;
                }
            });

            // Check for collision with player
            if (this.checkCollision(enemy, this.player)) {
                this.gameOver = true;
            }

            // Remove enemies that are off screen
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(enemyIndex, 1);
            }
        });

        // Update and draw particles
        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.02;
            particle.size *= 0.95;

            this.ctx.fillStyle = `${particle.color}${Math.floor(particle.life * 255).toString(16).padStart(2, '0')}`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            if (particle.life <= 0) this.particles.splice(index, 1);
        });

        // Draw game over screen
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '24px Poppins';
            this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
            this.ctx.fillText('Click "Start Game" to play again', this.canvas.width / 2, this.canvas.height / 2 + 100);
        }

        if (!this.gameOver) {
            this.gameLoop = requestAnimationFrame(() => this.update());
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    resizeCanvas() {
        const container = this.canvas.parentNode;
        const aspectRatio = 800 / 600;
        const width = container.offsetWidth;
        const height = width / aspectRatio;

        this.canvas.width = width;
        this.canvas.height = height;
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height - 50;
    }
}

// Initialize game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpaceShooter();
});
