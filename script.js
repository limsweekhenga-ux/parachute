const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const areaSlider = document.getElementById('areaSlider');
const areaVal = document.getElementById('areaVal');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

// Physics Constants
const gravity = 0.15;      // Downward pull
const airDensity = 0.01;   // Thickness of air
const soldierMass = 10;    // Weight of the toy
        
let y = 50; 
let velocity = 0;
let isRunning = false;
let animationFrame;

function drawSoldier(yPos, area) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const parachuteWidth = area * 1.5;

    // Draw Parachute Canopy
    ctx.beginPath();
    ctx.arc(centerX, yPos, parachuteWidth / 2, Math.PI, 0);
    ctx.fillStyle = "#e67e22";
    ctx.fill();
    ctx.strokeStyle = "#a04000";
    ctx.stroke();

    // Draw Strings
    ctx.beginPath();
    ctx.moveTo(centerX - parachuteWidth / 2, yPos);
    ctx.lineTo(centerX, yPos + 60);
    ctx.moveTo(centerX + parachuteWidth / 2, yPos);
    ctx.lineTo(centerX, yPos + 60);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw Toy Soldier
    ctx.fillStyle = "#2d5a27"; // Army Green
    // Body
    ctx.fillRect(centerX - 5, yPos + 60, 10, 20);
    // Head
    ctx.beginPath();
    ctx.arc(centerX, yPos + 55, 5, 0, Math.PI * 2);
    ctx.fill();
    // Arms (Hands by side)
    ctx.fillRect(centerX - 7, yPos + 60, 2, 15);
    ctx.fillRect(centerX + 5, yPos + 60, 2, 15);
    // Legs
    ctx.fillRect(centerX - 5, yPos + 80, 4, 10);
    ctx.fillRect(centerX + 1, yPos + 80, 4, 10);
}

function update() {
    if (!isRunning) return;

    let area = parseInt(areaSlider.value);
    
    // Drag Equation: Fd = 0.5 * rho * v^2 * A
    let drag = 0.5 * airDensity * (velocity * velocity) * area;
    let netForce = (soldierMass * gravity) - drag;
    let acceleration = netForce / soldierMass;

    velocity += acceleration;
    y += velocity;

    // Stop at the bottom
    if (y > canvas.height - 100) {
        y = canvas.height - 100;
        velocity = 0;
        isRunning = false;
    }

    drawSoldier(y, area);
    animationFrame = requestAnimationFrame(update);
}

// Controls
areaSlider.oninput = function() {
    areaVal.textContent = this.value;
    if (!isRunning) drawSoldier(y, this.value);
};

startBtn.onclick = () => {
    if (!isRunning && y < canvas.height - 100) {
        isRunning = true;
        update();
    }
};

stopBtn.onclick = () => {
    isRunning = false;
    cancelAnimationFrame(animationFrame);
};

resetBtn.onclick = () => {
    isRunning = false;
    cancelAnimationFrame(animationFrame);
    y = 50;
    velocity = 0;
    drawSoldier(y, areaSlider.value);
};

// Initial state
drawSoldier(y, 50);
