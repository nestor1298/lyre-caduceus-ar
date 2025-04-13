// File: script.js
// Purpose: Creates the interactive Three.js starfield background.
// AR Triggering: Handled by HTML <a rel="ar"> links, no JS needed here for that.

// Ensure Three.js library is loaded before running the script
if (typeof THREE === 'undefined') {
    console.error("Three.js library not found. Make sure it's included correctly in your HTML before this script.");
} else {
    // --- Three.js Starfield Setup ---

    // Get the canvas element from the HTML
    const canvas = document.getElementById('starfield-canvas');

    // Proceed only if the canvas element exists
    if (canvas) {
        // 1. Scene: Container for all objects, lights, cameras
        const scene = new THREE.Scene();

        // 2. Camera: Defines the view perspective
        // PerspectiveCamera(field of view, aspect ratio, near clipping plane, far clipping plane)
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // 3. Renderer: Renders the scene from the camera's perspective onto the canvas
        // WebGLRenderer uses WebGL; alpha: true allows for transparency if needed (though background is dark)
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true // Allows potential transparency if CSS background matters
        });

        // Set renderer size to match window dimensions
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Set pixel ratio for sharper images on high-density displays, capped at 2 for performance
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- Star Creation ---

        // 4. Geometry: Defines the shape/structure of the stars (points in this case)
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000; // Adjust for more/fewer stars
        // Create a Float32Array to hold (x, y, z) coordinates for each star
        const positions = new Float32Array(starCount * 3);

        // Populate the positions array with random coordinates
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3; // Index for x, y, z

            // Distribute stars within a spherical volume for a more natural look
            const radius = 300 + Math.random() * 400; // Random radius between 300 and 700
            const phi = Math.acos((2 * Math.random()) - 1); // Angle from the positive y-axis (vertical)
            const theta = Math.random() * Math.PI * 2;      // Angle around the y-axis (horizontal)

            positions[i3]     = radius * Math.sin(phi) * Math.cos(theta); // x
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
            positions[i3 + 2] = radius * Math.cos(phi);                   // z
        }

        // Add the position data as an attribute to the geometry
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // 3 values (x, y, z) per vertex

        // 5. Material: Defines the appearance of the stars
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,       // Star color (white)
            size: 0.6,             // Adjust size of each star point
            sizeAttenuation: true  // Points farther away appear smaller
        });

        // 6. Points Object: Combines geometry and material to create the starfield
        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField); // Add the starfield to the scene

        // Initial camera position (slightly back from the center)
        camera.position.z = 1; // Looking out from near the center

        // --- Responsiveness ---

        // Handle window resize events to keep aspect ratio correct
        window.addEventListener('resize', () => {
            // Update camera aspect ratio
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix(); // Apply the changes

            // Update renderer size
            renderer.setSize(window.innerWidth, window.innerHeight);
            // Update pixel ratio (important for window moves between screens)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // --- Animation Loop ---

        const clock = new THREE.Clock(); // Use Three.js Clock for smooth, frame-rate independent animation

        function animate() {
            // Request the next frame from the browser
            requestAnimationFrame(animate);

            // Get time elapsed since the clock started
            const elapsedTime = clock.getElapsedTime();

            // Add subtle rotation to the starfield for a dynamic effect
            // Adjust multipliers to change rotation speed
            starField.rotation.y = elapsedTime * 0.015;
            starField.rotation.x = elapsedTime * 0.01;

            // Render the scene from the perspective of the camera
            renderer.render(scene, camera);
        }

        // Start the animation loop
        animate();

    } else {
        // Log an error if the canvas element isn't found in the HTML
        console.error("Canvas element with ID 'starfield-canvas' not found.");
    }

} // End of THREE check block
