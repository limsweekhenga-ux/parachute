document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const areaSelect = document.getElementById('area-select');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const resetButton = document.getElementById('reset-button');
    const soldierParachute = document.getElementById('soldier-parachute');
    const parachuteVisual = document.querySelector('.parachute');
    const timeOutput = document.getElementById('time-output');

    // --- PHYSICS SETTINGS ---
    const HEIGHT_M = 400;
    const MASS_KG = 70;
    const GRAVITY = 9.81;
    const AIR_DENSITY = 1.225;
    const DRAG_COEFF = 1.4;
    const PIXEL_LIMIT = 320; // Landing point

    let animationTimeout;

    /**
     * Updates only the descent time and parachute size
     */
    function updateSettings() {
        const area = parseFloat(areaSelect.value);
        const weight = MASS_KG * GRAVITY;
        const terminalVel = Math.sqrt((2 * weight) / (AIR_DENSITY * area * DRAG_COEFF));
        const totalTime = HEIGHT_M / terminalVel;

        timeOutput.textContent = totalTime.toFixed(2);

        // Resize Parachute
        const pWidth = 40 + (area - 1) * 20;
        parachuteVisual.style.width = `${pWidth}px`;
        parachuteVisual.style.height = `${pWidth / 2}px`;

        // Reset to top
        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = '0px';
    }

    function startDescent() {
        const area = parseFloat(areaSelect.value);
        const weight = MASS_KG * GRAVITY;
        const terminalVel = Math.sqrt((2 * weight) / (AIR_DENSITY * area * DRAG_COEFF));
        const totalTime = HEIGHT_M / terminalVel;

        startButton.disabled = true;
        stopButton.disabled = false;
        areaSelect.disabled = true;

        // Reset to top before falling
        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = '0px';

        setTimeout(() => {
            soldierParachute.style.transition = `top ${totalTime.toFixed(2)}s linear`;
            soldierParachute.style.top = `${PIXEL_LIMIT}px`;
        }, 50);

        animationTimeout = setTimeout(() => {
            stopButton.disabled = true;
            startButton.disabled = false;
            areaSelect.disabled = false;
        }, totalTime * 1000);
    }

    function stopDescent() {
        clearTimeout(animationTimeout);
        
        // Capture current position and freeze
        const computedStyle = window.getComputedStyle(soldierParachute);
        const currentPos = computedStyle.getPropertyValue('top');
        
        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = currentPos;

        startButton.disabled = false;
        stopButton.disabled = true;
        areaSelect.disabled = false;
    }

    function resetDescent() {
        clearTimeout(animationTimeout);
        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = '0px';
        
        startButton.disabled = false;
        stopButton.disabled = true;
        areaSelect.disabled = false;
        updateSettings();
    }

    // --- LISTENERS ---
    areaSelect.addEventListener('change', updateSettings);
    startButton.addEventListener('click', startDescent);
    stopButton.addEventListener('click', stopDescent);
    resetButton.addEventListener('click', resetDescent);

    // Initial State
    updateSettings();
});
