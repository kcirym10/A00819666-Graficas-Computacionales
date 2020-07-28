// JavaScript source code
function initCanvas() {
    canvas = document.getElementById('myCanvas');

    if (!canvas)
        return;
}

function initScene() {
    //Create scene
    scene = new THREE.Scene();
    scene.background - new THREE.Color(0.2, 0.2, 0.2);

    //Create camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.y = 1.8;
    scene.add(camera);

    //Add global lighting
    let light = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(light);

    //let l = new THREE.DirectionalLight(0xffffff, 0.2);
    //l.position.set(-7, 1.7, -4);
    //l.target.set = new THREE.Vector3(-7, 0, -4);
    //scene.add(l);

    //Create the renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Add a floor
    let plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 100, 100), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0, 0) }));
    plane.position.z = -10;
    plane.rotateX(-Math.PI / 2)
    
    scene.add(plane);

    //Add event handlers
    listen();
}