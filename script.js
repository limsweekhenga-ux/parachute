document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const areaSelect = document.getElementById('area-select');
    const startButton = document.getElementById('start-button');
    const soldierParachute = document.getElementById('soldier-parachute');
    const timeOutput = document.getElementById('time-output');
    const animationContainer = document.getElementById('animation-container');
    const parachuteElement = document.querySelector('.parachute'); // New element to target

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
        const timeSeconds = HEIGHT / terminalVelocity;
        
        return timeSeconds;
    }

    /**
     * Updates the parachute's size visually and the time output.
     * @param {number} area - Surface area from the dropdown.
     */
    function updateSimulationVisuals(area) {
        // 1. Calculate and display time
        const timeSeconds = calculateTime(area);
        timeOutput.textContent = timeSeconds.toFixed(2);
        
        // 2. Adjust Parachute Size (Visual Change)
        // We will map the area (1m² to 5m²) to a pixel size (40px to 100px)
        const minArea = 1;
        const maxArea = 5;
        const minSize = 40; // Smallest parachute width in px
        const maxSize = 100; // Largest parachute width in px

        // Linear interpolation to map the area to a pixel size
        const sizeRatio = (area - minArea) / (maxArea - minArea);
        const newWidth = minSize + sizeRatio * (maxSize - minSize);
        
        // Apply the new width to the parachute element
        parachuteElement.style.width = `${newWidth}px`;
        // Keep the height proportional to the width (e.g., half the width for the dome shape)
        parachuteElement.style.height = `${newWidth / 2}px`;
    }

    /**
     * Executes the animation based on the calculated time.
     */
    function startAnimation() {
        const area = parseFloat(areaSelect.value);
        const timeSeconds = calculateTime(area);
        
        // Disable button and reset position
        startButton.disabled = true;
        soldierParachute.style.top = '0px';
        soldierParachute.style.transition = 'none'; // Remove transition for reset

        // Force a reflow to apply 'none' before adding the new transition
        void soldierParachute.offsetHeight; 

        // Set the CSS transition properties
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
    
    // Listener to update visuals when selection changes
    areaSelect.addEventListener('change', (event) => {
        updateSimulationVisuals(parseFloat(event.target.value));
    });

    // Initial setup when page loads
    updateSimulationVisuals(parseFloat(areaSelect.value));
});
