// Ensure Three.js is loaded before running
if (typeof THREE === 'undefined') {
    console.error("Three.js library not found. Make sure it's included before this script.");
} else {
    // --- Three.js Starfield Setup ---
    const canvas = document.getElementById('starfield-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // alpha: true for transparent background if needed

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Improve performance on high-res displays

        // Star Geometry
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000; // Number of stars
        const positions = new Float32Array(starCount * 3); // x, y, z for each star

        for (let i = 0; i < starCount * 3; i++) {
            // Distribute stars within a sphere-like volume
            const radius = 300; // Adjust radius as needed
            const phi = Math.acos((2 * Math.random()) - 1); // Angle from y-axis
            const theta = Math.random() * Math.PI * 2;      // Angle around y-axis

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
            positions[i * 3 + 2] = radius * Math.cos(phi);                  // z
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Star Material
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,       // White stars
            size: 0.5,             // Adjust size
            sizeAttenuation: true  // Stars farther away appear smaller
        });

        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);

        camera.position.z = 1; // Start camera slightly inside the starfield center

        // Handle Window Resize
        window.addEventListener('resize', () => {
            // Update camera aspect ratio
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            // Update renderer size
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // Animation Loop
        const clock = new THREE.Clock(); // Use clock for smoother animation
        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Subtle rotation
            starField.rotation.y = elapsedTime * 0.02; // Adjust speed as desired
            starField.rotation.x = elapsedTime * 0.01;

            renderer.render(scene, camera);
        }

        animate(); // Start the animation loop

    } else {
        console.error("Canvas element with ID 'starfield-canvas' not found.");
    }

    // --- WebAR Button Placeholder Interaction ---
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.addEventListener('click', () => {
            // THIS IS A PLACEHOLDER
            // In a real application, this would trigger the WebAR experience:
            // 1. Check for AR support (e.g., using navigator.xr)
            // 2. Request an AR session
            // 3. Load the 3D models (Caduceus, Tablet) using a library like Three.js or A-Frame
            // 4. Anchor the models in the real world using the AR session data.
            // OR:
            // Redirect to a .usdz or .glb file URL if using simple model-viewer intents.
            // OR:
            // Call functions from a specific WebAR SDK (like 8th Wall, MindAR).

            alert('Placeholder: WebAR experience launching!\n(This would activate AR and show 3D models)');

            // Example of trying to open a model file directly (highly browser/OS dependent)
            // window.open('path/to/your/model.usdz'); // For iOS Quick Look
            // or use an <a rel="ar"> link in the HTML
        });
    } else {
        console.error("Button element with ID 'ar-button' not found.");
    }
} // End of THREE check block
