// Neural Network Background Animation
const canvas = document.getElementById('neuralBackground');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const maxNeurons = 25;
const neurons = [];
const maxConnections = 3;
const maxDistance = 250;
const spawnRate = 0.03;

class Neuron {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 2 + Math.random() * 3;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.connections = [];
        this.color = '#34eb8f';
        this.alpha = 0;
        this.life = 0;
        this.maxLife = 300 + Math.random() * 200;
        this.fadingIn = true;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        this.life++;
        
        if (this.fadingIn) {
            this.alpha += 0.02;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.fadingIn = false;
            }
        } else if (this.life > this.maxLife * 0.7) {
            this.alpha -= 0.01;
        }
    }
    
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        for (const connection of this.connections) {
            const target = connection.target;
            const distance = connection.distance;
            const connectionAlpha = (1 - distance / maxDistance) * this.alpha * 0.6;
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(0, 255, 0, ${connectionAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    shouldRemove() {
        return this.life >= this.maxLife || this.alpha <= 0;
    }
}

function spawnNeuron() {
    if (neurons.length < maxNeurons && Math.random() < spawnRate) {
        neurons.push(new Neuron());
    }
}

function updateConnections() {
    for (const neuron of neurons) {
        neuron.connections = [];
        const distances = [];
        
        for (const other of neurons) {
            if (neuron === other) continue;
            
            const dx = other.x - neuron.x;
            const dy = other.y - neuron.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                distances.push({
                    target: other,
                    distance: distance
                });
            }
        }
        
        distances.sort((a, b) => a.distance - b.distance);
        
        for (let i = 0; i < Math.min(maxConnections, distances.length); i++) {
            neuron.connections.push(distances[i]);
        }
    }
}

function animateNeurons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    spawnNeuron();
    
    for (let i = neurons.length - 1; i >= 0; i--) {
        neurons[i].update();
        
        if (neurons[i].shouldRemove()) {
            neurons.splice(i, 1);
        }
    }
    
    updateConnections();
    
    for (const neuron of neurons) {
        neuron.draw();
    }
    
    requestAnimationFrame(animateNeurons);
}

// Initialize with 5 neurons
for (let i = 0; i < 5; i++) {
    neurons.push(new Neuron());
}

animateNeurons();

window.addEventListener('resize', () => {
    resizeCanvas();
});