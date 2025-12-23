document.addEventListener('DOMContentLoaded', () => {
    const areaSelect = document.getElementById('area-select');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const resetButton = document.getElementById('reset-button');
    const soldierParachute = document.getElementById('soldier-parachute');
    const parachuteVisual = document.querySelector('.parachute');
    const timeOutput = document.getElementById('time-output');

    // Constants
    const HEIGHT_M = 400;
    const MASS_KG = 70;
    const GRAVITY = 9.81;
    const AIR_DENSITY = 1.225;
    const DRAG_COEFF = 1.4;
    const LANDING_PX = 320;

    let animationTimeout;

    function getPhysics() {
        const area = parseFloat(areaSelect.value);
        const weight = MASS_KG * GRAVITY;
        const vt = Math.sqrt((2 * weight) / (AIR_DENSITY * area * DRAG_COEFF));
        return HEIGHT_M / vt;
    }

    function updateVisuals() {
        const time = getPhysics();
        timeOutput.textContent = time.toFixed(2);

        // Adjust Parachute Size
        const area = parseFloat(areaSelect.value);
        const pWidth = 40 + (area - 1) * 25;
        parachuteVisual.style.width = `${pWidth}px`;
        parachuteVisual.style.height = `${pWidth / 2}px`;

        // Reset to top
        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = '0px';
    }

    function start() {
        const time = getPhysics();
        startButton.disabled = true;
        stopButton.disabled = false;
        areaSelect.disabled = true;

        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = '0px';

        setTimeout(() => {
            soldierParachute.style.transition = `top ${time.toFixed(2)}s linear`;
            soldierParachute.style.top = `${LANDING_PX}px`;
        }, 50);

        animationTimeout = setTimeout(() => {
            stopButton.disabled = true;
            startButton.disabled = false;
            areaSelect.disabled = false;
        }, time * 1000);
    }

    function stop() {
        clearTimeout(animationTimeout);
        const currentTop = window.getComputedStyle(soldierParachute).top;
        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = currentTop;

        startButton.disabled = false;
        stopButton.disabled = true;
        areaSelect.disabled = false;
    }

    function reset() {
        clearTimeout(animationTimeout);
        soldierParachute.style.transition = 'none';
        soldierParachute.style.top = '0px';
        startButton.disabled = false;
        stopButton.disabled = true;
        areaSelect.disabled = false;
        updateVisuals();
    }

    areaSelect.addEventListener('change', updateVisuals);
    startButton.addEventListener('click', start);
    stopButton.addEventListener('click', stop);
    resetButton.addEventListener('click', reset);

    updateVisuals();
});
