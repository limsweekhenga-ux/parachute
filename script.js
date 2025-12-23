document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const surfaceSelect = document.getElementById('surface-select');
    const surfaceDisplay = document.getElementById('surface-display');
    const requiredForceDisplay = document.getElementById('required-force-display');
    const forceDisplay = document.getElementById('force-display'); // Used to display the number
    const pullFeedback = document.getElementById('pull-feedback');
    const blockAndSpring = document.getElementById('block-and-spring');
    const woodBlock = document.getElementById('wood-block'); 
    
    // NEW: Target the indicator element for visual stretching
    const scaleIndicator = document.querySelector('.scale-indicator'); 

    // Physics Constants and Variables
    const MASS_BLOCK = 0.5; // kg
    const GRAVITY = 9.81; // m/s^2
    let requiredPullForce = 0; 

    // Dragging state variables
    let isDragging = false;
    const START_OFFSET = 10; // Initial left position (in percentage)
    const MAX_PULL_PIXELS = 300; // Max distance the block can be dragged
    const FORCE_TO_PIXEL_RATIO = 50; // How many pixels of stretch equals 1 Newton of force (50 px/N)
    
    // Spring Balance visual stretching constants
    const MAX_INDICATOR_STRETCH = 50; // Max pixels the indicator can stretch

    // Friction Coefficients 
    const frictionCoefficients = {
        plastic: 0.1,    
        metal: 0.25,     
        sandpaper: 0.5,  
        carpet: 0.8      
    };

    /**
     * Calculates the required pulling force based on the selected surface.
     */
    function updateRequiredForce(surfaceKey) {
        const mu_k = frictionCoefficients[surfaceKey];
        requiredPullForce = mu_k * MASS_BLOCK * GRAVITY;

        // Update visuals and reset block position
        surfaceDisplay.className = '';
        surfaceDisplay.classList.add(surfaceKey);
        requiredForceDisplay.textContent = requiredPullForce.toFixed(2);
        
        // Reset block position and spring indicator
        blockAndSpring.style.transform = 'translateX(0px)';
        scaleIndicator.style.transform = `translateX(0px)`;
        forceDisplay.textContent = '0.00';
        pullFeedback.textContent = 'Click and drag the block to pull.';
        pullFeedback.style.color = '#333';
    }

    /**
     * Handles the start of the dragging action.
     */
    function startDrag(e) {
        isDragging = true;
        e.preventDefault(); 
        
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchmove', dragMove);
        window.addEventListener('touchend', dragEnd);
    }

    /**
     * Handles the movement while dragging.
     */
    function dragMove(e) {
        if (!isDragging) return;

        const clientX = e.clientX || e.touches[0].clientX;
        const simAreaRect = document.getElementById('simulation-area').getBoundingClientRect();
        
        let dragDistance = clientX - simAreaRect.left - (simAreaRect.width * START_OFFSET / 100);
        dragDistance = Math.max(0, Math.min(dragDistance, MAX_PULL_PIXELS));
        
        const appliedForce = dragDistance / FORCE_TO_PIXEL_RATIO;
        
        // 1. Update the visual spring balance number
        forceDisplay.textContent = appliedForce.toFixed(2);
        
        // 2. Animate the spring indicator visually
        // The pull distance is small since the spring stretches, not the whole block container
        const indicatorStretch = appliedForce * (MAX_INDICATOR_STRETCH / requiredPullForce);
        const stretchAmount = Math.min(indicatorStretch, MAX_INDICATOR_STRETCH);
        
        // Move the whole block and spring assembly to the right
        blockAndSpring.style.transform = `translateX(${dragDistance}px)`;
        
        // Move the spring indicator to the left (negative X) to simulate extension
        scaleIndicator.style.transform = `translateX(${-stretchAmount}px)`;


        // Provide movement feedback
        if (appliedForce >= requiredPullForce) {
            pullFeedback.textContent = `SUCCESS! Block is moving at ${appliedForce.toFixed(2)} N.`;
            pullFeedback.style.color = '#5cb85c'; 
        } else if (appliedForce > 0) {
            pullFeedback.textContent = 'Force applied, but not enough to move the block.';
            pullFeedback.style.color = '#f0ad4e'; 
        } else {
            pullFeedback.textContent = 'Click and drag the block to pull.';
            pullFeedback.style.color = '#333';
        }
    }

    /**
     * Handles the end of the dragging action.
     */
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchmove', dragMove);
        window.removeEventListener('touchend', dragEnd);
        
        // Snap the block back and reset indicator
        blockAndSpring.style.transform = 'translateX(0px)';
        scaleIndicator.style.transform = `translateX(0px)`;
        forceDisplay.textContent = '0.00';
        updateRequiredForce(surfaceSelect.value); 
    }

    // --- EVENT LISTENERS ---
    surfaceSelect.addEventListener('change', (event) => {
        updateRequiredForce(event.target.value);
    });

    woodBlock.addEventListener('mousedown', startDrag);
    woodBlock.addEventListener('touchstart', startDrag);


    // Initialize the simulation with the default surface
    updateRequiredForce(surfaceSelect.value);
});
