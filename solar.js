let scene, camera, renderer, planets = [], currentPlanetIndex = 2;
let isDragging = false, dragPath = [], lastDirection = null;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cahaya matahari
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 0);
    scene.add(light);

    // Tambah planet (Merkurius hingga Neptunus)
    const planetColors = [0xaaaaff, 0xffff00, 0x3399ff, 0xff3300, 0xffa500, 0x00ffff, 0x9932CC, 0x6495ED];
    for (let i = 0; i < 8; i++) {
        const geo = new THREE.SphereGeometry(0.5 + i * 0.1, 32, 32);
        const mat = new THREE.MeshStandardMaterial({ color: planetColors[i] });
        const planet = new THREE.Mesh(geo, mat);
        planet.position.x = (i - 2) * 4; // jarak antar planet
        planets.push(planet);
        scene.add(planet);
    }

    // Fokus kamera ke planet ke-3 (Earth)
    camera.position.z = 5;
    camera.position.x = planets[currentPlanetIndex].position.x;

    // Event mouse
    document.addEventListener('mousedown', () => { isDragging = true; dragPath = []; });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        handleGesture();
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            dragPath.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        }
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Putar planet
    planets.forEach(p => p.rotation.y += 0.01);

    renderer.render(scene, camera);
}

function handleGesture() {
    if (dragPath.length < 3) return;
    const dx = dragPath[dragPath.length - 1].x - dragPath[0].x;
    const dy = dragPath[dragPath.length - 1].y - dragPath[0].y;

    if (Math.abs(dx) > 100 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) nextPlanet(); else prevPlanet();
    } else if (Math.abs(dy) > 100) {
        if (dy > 0) nextPlanet(); else prevPlanet();
    } else if (isCircularMotion(dragPath)) {
        rotateSystem();
    }
}

function nextPlanet() {
    if (currentPlanetIndex < planets.length - 1) {
        currentPlanetIndex++;
        camera.position.x = planets[currentPlanetIndex].position.x;
    }
}

function prevPlanet() {
    if (currentPlanetIndex > 0) {
        currentPlanetIndex--;
        camera.position.x = planets[currentPlanetIndex].position.x;
    }
}

function rotateSystem() {
    scene.rotation.y += 0.5;
}

// Cek gerakan melingkar (sederhana)
function isCircularMotion(path) {
    const dx = path[path.length - 1].x - path[0].x;
    const dy = path[path.length - 1].y - path[0].y;
    return Math.abs(dx) > 50 && Math.abs(dy) > 50;
}
