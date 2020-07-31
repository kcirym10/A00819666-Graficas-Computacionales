// JavaScript source code

let canvas = null,
    scene = null,
    camera = null,
    renderer = null,
    player = null,
    gltfLoader = new THREE.GLTFLoader(),
    dracoLoader = new THREE.DRACOLoader(),
    game = null,
    map = null,
    objects = [],
    listener = new THREE.AudioListener(),
    weapons = [
        new Weapon(0, 15, false, 0.001, 'pistol', 64, 8, 350, 150, 1, '9mm - gunshot'),    //Pistol
        new Weapon(1, 6, true, 0.1, 'rifle', 280, 35, 650, 50, 4, '9mm-gunshot')       //Rifle
    ];


$(document).ready(
    function () {
        //Get the canvas
        initCanvas();

        //Initialize all basic elements
        initScene(canvas);

        //Start a new game
        game = new Game();
        game.newGame();

        run();
    }
);

function run() {
    requestAnimationFrame(() => run());
    if (!game.paused) {
        update();

        renderer.render(scene, camera);
    };
}

function update() {

    game.update();
    player.update();

}