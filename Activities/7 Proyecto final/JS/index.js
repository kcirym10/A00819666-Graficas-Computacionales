// JavaScript source code

let canvas = null,
    scene = null,
    camera = null,
    renderer = null,
    player = null,
    gltfLoader = new THREE.GLTFLoader(),
    game = null,
    map = null,
    objects = [],
    weapons = [
        new Weapon(0, 15, false, 0.5)       //Pistol
    ];


$(document).ready(
    function () {
        //Get the canvas
        initCanvas();
        //Initialize all basic elements
        initScene(canvas);

        game = new Game();
        game.newGame();

        //for (let i = 0; i < 10; i++) {
        //    let box = (new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshLambertMaterial()));
        //    box.name = 'box';
        //    box.position.set(Math.random() * 40 - 20, 2, Math.random() * 40 - 20);
        //    scene.add(box);
        //    objects.push(box);
        //}

        run();
    }
);

function run() {
    requestAnimationFrame(() => run());
    if (!game.isPaused) {
        update();

        renderer.render(scene, camera);
    };
}

function update() {

    player.update();

}