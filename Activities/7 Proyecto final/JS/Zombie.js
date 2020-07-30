// JavaScript source code
class Zombie extends THREE.Object3D {
    constructor() {
        super();
        this.speed = 0.05;
        this.health = 100;
        this.dmg = 20;
        this.dimensions = 0.015;
        this.isForward = true;
        this.isBackward = true;
        this.isLeft = true;
        this.isRight = true;
        this.instanceZombie();
        this.verticalDisplacement = 0.5;
        this.isFloatingDown = true;
    }

    //Called every frame
    update() {
        this.move();
    }

    //Damage when shot
    takeDmg(dmg) {
        this.health -= dmg;

        if (this.health <= 0)
            this.killed()
    }

    //Controls movement
    move() {
        //Check for collision
        let pos = this.position;

        //Reset movement flags
        this.isForward = true;
        this.isBackward = true;
        this.isLeft = true;
        this.isRight = true;


        ////Detect height changes
        //let ray = new THREE.Raycaster(
        //    new THREE.Vector3(pos.x, pos.y + 0.5, pos.z),
        //    new THREE.Vector3(0, -1, 0),
        //    0,
        //    3
        //);
        //let o = ray.intersectObjects(scene.children, true);

        //if (o.length > 0) {
        //    if (o[0].distance < 0.3) {
        //        this.position.y += 0.3;
        //    }
        //    else if (o[0].distance > 0.6) {
        //        this.position.y -= 0.3;
        //    }
        //}

        //Move
        let playerPos = player.controls.getObject().position;

        this.lookAt(playerPos.x, this.position.y, playerPos.z);

        //Move forward and backward
        if (this.isForward && playerPos.z > this.position.z + 0.2) {
            this.position.z += this.speed;
        }
        else if (this.isBackward && playerPos.z < this.position.z - 0.2) {
            this.position.z -= this.speed;
        }
        //Move right and left
        if (this.isRight && playerPos.x > this.position.x + 0.2) {
            this.position.x += this.speed;
            this.rotation.y += this.speed;
        }
        else if (this.isLeft && playerPos.x < this.position.x - 0.2) {
            this.position.x -= this.speed;
            this.rotation.y -= this.speed;
        }

        //Make it appear to float up and down
        if (this.position.y <= -this.verticalDisplacement)
            this.isFloatingDown = false;
        else if (this.position.y >= this.verticalDisplacement)
            this.isFloatingDown = true;

        if (this.isFloatingDown) {
            this.position.y -= 0.02;
        }
        else {
            this.position.y += 0.02;
        }
    }

    killed() {
        //Reduce the number of active zombies and the number of zombies left in a round
        --game.activeZombies;
        --game.zombiesLeft;
        
        //New spawn timer
        game.spawnTimer = performance.now();
        //Remove from game
        scene.remove(this);

        //Remove killed zombie from game array
        let index = game.zombies.indexOf(this);
        game.zombies.splice(index, 1);
    }
    //Generate zombie model
    instanceZombie() {
        const that = this;

        //Load zombie model
        gltfLoader
            .load(
                // resource URL
                'Models/ghost.glb',
                // called when resource is loaded
                function (object) {
                    object.scene.scale.set(that.dimensions, that.dimensions, that.dimensions);
                    that.add(object.scene);
                    //let light = new THREE.DirectionalLight(0xffffff, 1.0);
                    //light.position.set(0, 3, 10);
                    //that.add(light);

                },
                // called when loading is in progresses
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened ' + error);

                });
    }
}
