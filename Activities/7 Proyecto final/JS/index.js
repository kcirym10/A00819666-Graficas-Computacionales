// JavaScript source code

let canvas = null,
    scene = null,
    camera = null,
    renderer = null,
    player = null,
    //Material loader
    mtlLoader = new THREE.MTLLoader(),
    //Object loader
    objLoader = new THREE.OBJLoader(),
    game = null;


$(document).ready(
    function () {
        initCanvas();
        initScene(canvas);

        game = new Game();
        zombie = new Zombie();

        scene.add(zombie);

        console.log(player);

        run();
    }
);

function run() {
    requestAnimationFrame(() => run());
    if (!game.isPaused) {
        update();

        for (let i = 0; i < player.rays.length; i++) {
            if (player.rays.length > 0) {
                
                //console.log('Position: ', player.controls.getObject().position);
                //console.log('Ray: ', player.rays[i].ray.origin);

                console.log(player.rays[i].intersectObjects(scene.children))
            }
        }
        

        renderer.render(scene, camera);
    };
}

function update() {
    if (player.isMoving)
        player.move();

    if (player.isAiming)
        player.aim();
}