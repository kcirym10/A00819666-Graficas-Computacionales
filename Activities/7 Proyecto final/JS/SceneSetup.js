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

    //Add fog
    //Fog
    //scene.fog = new THREE.Fog(new THREE.Color(0.2, 0.2, 0.2), 0.1, 55);
    //Fog exponential
    scene.fog = new THREE.FogExp2(new THREE.Color(0.2, 0.2, 0.2), 0.07);

    //Create camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.y = 1.8;
    camera.position.z = 2;
    scene.add(camera);

    //Audio
    camera.add(listener);

    //Add global lighting
    let light = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(light);

    light = new THREE.SpotLight(0xffffff, 0.15, 200, Math.PI / 3);
    light.position.set(0, 50, 0);
    scene.add(light);

    //Create the renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Add a floor
    let texture = new THREE.TextureLoader().load('./Textures/ground.jpg');
    let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 100, 100),
        new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 1.0 })
    );

    texture.wrapS = THREE.ReapeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);

    plane.position.z = -10;
    plane.rotateX(-Math.PI / 2)
    
    scene.add(plane);

    //Add event handlers
    listen();
}