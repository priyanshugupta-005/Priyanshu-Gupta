// Interactive 3D Background with Three.js & Animated Slide Choreography
// Designed for Priyanshu's B.Tech Portfolio

(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.0018);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 80);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 3, 220);
    pointLight1.position.set(45, 45, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2.5, 220);
    pointLight2.position.set(-45, -45, 30);
    scene.add(pointLight2);

    const pointLightAccent = new THREE.PointLight(0xf59e0b, 1.5, 180);
    pointLightAccent.position.set(0, 30, 20);
    scene.add(pointLightAccent);

    // 3. Floating 3D Geometric Objects (Wireframe + Glow)
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    // Materials
    const wireMaterialCyan = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4
    });

    const wireMaterialViolet = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x7e22ce,
        emissiveIntensity: 0.4
    });

    const wireMaterialGold = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        wireframe: true,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0xd97706,
        emissiveIntensity: 0.3
    });

    const wireMaterialEmerald = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x059669,
        emissiveIntensity: 0.4
    });

    // 3D Polyhedra Setup
    const shapes = [];

    // Icosahedron (Hero Tech Core)
    const icoGeo = new THREE.IcosahedronGeometry(13, 1);
    const icoMesh = new THREE.Mesh(icoGeo, wireMaterialCyan);
    icoMesh.position.set(38, 12, -8);
    shapesGroup.add(icoMesh);
    shapes.push({ mesh: icoMesh, rx: 0.003, ry: 0.005, rz: 0.002, basePos: new THREE.Vector3(38, 12, -8) });

    // Inner glowing sphere inside icosahedron
    const innerGeo = new THREE.SphereGeometry(6.5, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    icoMesh.add(innerMesh);

    // Octahedron (Chess & Strategy Symbol)
    const octGeo = new THREE.OctahedronGeometry(9, 0);
    const octMesh = new THREE.Mesh(octGeo, wireMaterialViolet);
    octMesh.position.set(-42, -16, -12);
    shapesGroup.add(octMesh);
    shapes.push({ mesh: octMesh, rx: -0.004, ry: 0.006, rz: 0.003, basePos: new THREE.Vector3(-42, -16, -12) });

    // Torus (Continuous Learning & Skills)
    const torusGeo = new THREE.TorusGeometry(8, 2.2, 12, 32);
    const torusMesh = new THREE.Mesh(torusGeo, wireMaterialGold);
    torusMesh.position.set(-32, 28, -20);
    shapesGroup.add(torusMesh);
    shapes.push({ mesh: torusMesh, rx: 0.006, ry: -0.003, rz: 0.005, basePos: new THREE.Vector3(-32, 28, -20) });

    // Sports / Badminton Geometry (Double Cones / Dodecahedron)
    const dodGeo = new THREE.DodecahedronGeometry(6, 0);
    const dodMesh1 = new THREE.Mesh(dodGeo, wireMaterialEmerald);
    dodMesh1.position.set(28, -32, -18);
    shapesGroup.add(dodMesh1);
    shapes.push({ mesh: dodMesh1, rx: 0.005, ry: 0.004, rz: -0.002, basePos: new THREE.Vector3(28, -32, -18) });

    const dodMesh2 = new THREE.Mesh(dodGeo, wireMaterialViolet);
    dodMesh2.position.set(5, 42, -30);
    shapesGroup.add(dodMesh2);
    shapes.push({ mesh: dodMesh2, rx: -0.003, ry: -0.005, rz: 0.004, basePos: new THREE.Vector3(5, 42, -30) });

    // 4. Particle Constellation Field
    const particleCount = 1350;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 250;
        posArray[i + 1] = (Math.random() - 0.5) * 250;
        posArray[i + 2] = (Math.random() - 0.5) * 180 - 20;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Particle Texture
    const createParticleTexture = () => {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const ctx = pCanvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(56, 189, 248, 0.9)');
        gradient.addColorStop(0.65, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.Texture(pCanvas);
        texture.needsUpdate = true;
        return texture;
    };

    const particleMaterial = new THREE.PointsMaterial({
        size: 2.4,
        map: createParticleTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.9
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Slide 3D Choreography Configuration
    // Camera coordinates and look-at targets for each slide (0 to 5)
    const slideCameraConfigs = [
        // Slide 0: Hero (Center overview, dynamic tech icosahedron in view)
        {
            camPos: new THREE.Vector3(0, 0, 80),
            lookTarget: new THREE.Vector3(0, 0, 0),
            groupRotY: 0,
            lightColor: 0x38bdf8
        },
        // Slide 1: About Me (Pan right, highlight student card and octahedron)
        {
            camPos: new THREE.Vector3(-18, -6, 72),
            lookTarget: new THREE.Vector3(12, 0, 0),
            groupRotY: 0.35,
            lightColor: 0x818cf8
        },
        // Slide 2: Education (Elevated tilt along academic timeline)
        {
            camPos: new THREE.Vector3(16, 20, 75),
            lookTarget: new THREE.Vector3(-8, 5, 0),
            groupRotY: -0.3,
            lightColor: 0x06b6d4
        },
        // Slide 3: Skills (Zoom into golden torus and programming core)
        {
            camPos: new THREE.Vector3(-22, 14, 68),
            lookTarget: new THREE.Vector3(-10, 10, -5),
            groupRotY: 0.6,
            lightColor: 0xf59e0b
        },
        // Slide 4: Achievements (Dynamic low angle focusing on sports/chess geometry)
        {
            camPos: new THREE.Vector3(20, -18, 70),
            lookTarget: new THREE.Vector3(-5, -10, 0),
            groupRotY: -0.5,
            lightColor: 0x10b981
        },
        // Slide 5: Contact (Expansive wide cosmos view)
        {
            camPos: new THREE.Vector3(0, -10, 88),
            lookTarget: new THREE.Vector3(0, 0, 0),
            groupRotY: 0,
            lightColor: 0xa855f7
        }
    ];

    let currentSlide = 0;
    const targetCamPos = new THREE.Vector3(0, 0, 80);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);
    let targetGroupRotY = 0;

    // Public function called when slide changes
    window.setSlide3DState = function(index) {
        if (index < 0 || index >= slideCameraConfigs.length) return;
        currentSlide = index;
        const config = slideCameraConfigs[index];
        targetCamPos.copy(config.camPos);
        targetLookAt.copy(config.lookTarget);
        targetGroupRotY = config.groupRotY;
        
        // Dynamic point light shift
        pointLight1.color.setHex(config.lightColor);
    };

    // 6. Mouse Interaction & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function onMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.035;
        mouseY = (event.clientY - windowHalfY) * 0.035;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    function onTouchMove(event) {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX) * 0.035;
            mouseY = (event.touches[0].clientY - windowHalfY) * 0.035;
        }
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // 7. Animation Loop with Smooth Interpolation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse damping
        targetMouseX += (mouseX - targetMouseX) * 0.05;
        targetMouseY += (mouseY - targetMouseY) * 0.05;

        // Smooth camera slide-to-slide position lerp
        camera.position.x += (targetCamPos.x + targetMouseX - camera.position.x) * 0.045;
        camera.position.y += (targetCamPos.y - targetMouseY - camera.position.y) * 0.045;
        camera.position.z += (targetCamPos.z - camera.position.z) * 0.045;

        // Smooth lookAt target lerp
        currentLookAt.x += (targetLookAt.x - currentLookAt.x) * 0.045;
        currentLookAt.y += (targetLookAt.y - currentLookAt.y) * 0.045;
        currentLookAt.z += (targetLookAt.z - currentLookAt.z) * 0.045;
        camera.lookAt(currentLookAt);

        // Group rotation lerp based on slide
        shapesGroup.rotation.y += (targetGroupRotY - shapesGroup.rotation.y) * 0.03;

        // Slow rotation of particles
        particleSystem.rotation.y = elapsedTime * 0.015;
        particleSystem.rotation.x = elapsedTime * 0.008;

        // Floating geometric shapes rotation & bobbing
        shapes.forEach((item, index) => {
            item.mesh.rotation.x += item.rx;
            item.mesh.rotation.y += item.ry;
            item.mesh.rotation.z += item.rz;

            // Fluid sinusoidal bobbing
            item.mesh.position.y = item.basePos.y + Math.sin(elapsedTime * 1.6 + index * 1.2) * 1.8;
            item.mesh.position.x = item.basePos.x + Math.cos(elapsedTime * 1.2 + index) * 0.8;
        });

        renderer.render(scene, camera);
    }

    animate();
})();
