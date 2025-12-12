document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const areaSelect = document.getElementById('area-select');
    const startButton = document.getElementById('start-button');
    const soldierParachute = document.getElementById('soldier-parachute');
    const timeOutput = document.getElementById('time-output');
    const animationContainer = document.getElementById('animation-container');

    // --- PHYSICS CONSTANTS ---
    const HEIGHT = 500; // Simulated height of descent in meters
    const MASS = 100; // Total mass of soldier and gear in kg
    const DRAG_COEFFICIENT = 1.5; // Cd, typical for a parachute
    const AIR_DENSITY = 1.225; // rho, kg/m^3
    const GRAVITY = 9.81; // g, m/s^2

    // The pixel distance the animation covers
    const ANIMATION_DISTANCE_PX = 450; 
    
    // Set initial position
    soldierParachute.style.top = '0px'; 
    startButton.disabled = false;


    /**
     * Calculates the time taken for descent based on surface area.
     * @param {number} area - Surface area of the parachute (m²).
     * @returns {number} The calculated time in seconds.
     */
    function calculateTime(area) {
        // 1. Calculate Terminal Velocity (Vt)
        // Formula: Vt = sqrt( (2 * mass * g) / (rho * Area * Cd) )
        const vt_squared = (2 * MASS * GRAVITY) / (AIR_DENSITY * area * DRAG_COEFFICIENT);
        const terminalVelocity = Math.sqrt(vt_squared);

        // 2. Calculate Descent Time (approximated)
        // Time is Height / Average Velocity. 
        // We use the full height (500m) divided by the terminal velocity.
        const timeSeconds = HEIGHT / terminalVelocity;
        
        return timeSeconds;
    }

    /**
     * Executes the animation based on the calculated time.
     */
    function startAnimation() {
        const area = parseFloat(areaSelect.value);
        const timeSeconds = calculateTime(area);
        
        timeOutput.textContent = timeSeconds.toFixed(2);
        
        // Disable button and reset position
        startButton.disabled = true;
        soldierParachute.style.top = '0px';
        soldierParachute.style.transition = 'none'; // Remove transition for reset

        // Force a reflow to apply 'none' before adding the new transition
        void soldierParachute.offsetHeight; 

        // Set the CSS transition properties:
        // Transition property: top
        // Duration: timeSeconds (mapped to seconds, so 1:1)
        // Easing: linear (since terminal velocity is constant)
        soldierParachute.style.transition = `top ${timeSeconds.toFixed(2)}s linear`;
        
        // Start the animation by setting the final position
        soldierParachute.style.top = `${ANIMATION_DISTANCE_PX}px`; 

        // Re-enable button after animation finishes
        setTimeout(() => {
            startButton.disabled = false;
        }, timeSeconds * 1000); // Convert seconds to milliseconds
    }

    // --- EVENT LISTENERS ---
    startButton.addEventListener('click', startAnimation);
    
    // Initial calculation display
    areaSelect.addEventListener('change', () => {
        const area = parseFloat(areaSelect.value);
        const timeSeconds = calculateTime(area);
        timeOutput.textContent = timeSeconds.toFixed(2);
    });

    // Run initial calculation when page loads
    const initialArea = parseFloat(areaSelect.value);
    timeOutput.textContent = calculateTime(initialArea).toFixed(2);
});