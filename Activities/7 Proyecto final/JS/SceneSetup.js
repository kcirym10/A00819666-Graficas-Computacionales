// JavaScript source code
function initCanvas() {
    canvas = document.getElementById('myCanvas');

    if (!canvas)
        return;
}

function initScene() {
    scene = new THREE.Scene();
    scene.background - new THREE.Color(0.2, 0.2, 0.2);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.y = 1.8;
    camera.rotation.y = Math.PI / 2;
    scene.add(camera);

    let light = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 100, 100), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0, 0) }));
    plane.position.z = -10;
    plane.rotateX( -Math.PI / 2 )
    
    scene.add(plane);

    listen();
}