// JavaScript source code

let canvas = null,
    scene = null,
    camera = null,
    renderer = null,
    player = null;


$(document).ready(
    function () {
        initCanvas();
        initScene(canvas);

        player = new Player();
        scene.add(player);

        run();
    }
);

function run() {
    requestAnimationFrame(() => run());

    update();

    renderer.render(scene, camera);
}

function update() {
    if (player.isMoving)
        player.move();

    if (player.isAiming)
        player.aim();
}