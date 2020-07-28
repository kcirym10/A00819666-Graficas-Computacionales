// JavaScript source code
class Zombie extends THREE.Object3D {
    constructor() {
        super();
        this.health = 100;
        this.dmg = 45;
        this.dimensions = 4.2;
        this.instanceZombie();
    }

    //Called every frame
    update() {

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

        let rays = [];
        let pos = this.controls.getObject().position,
            dir = this.controls.getDirection(new THREE.Vector3).clone();

        //Create rays around player
        for (let i = 0; i < 8; i++) {
            rays.push(
                new THREE.Raycaster(new THREE.Vector3(pos.x, 1.8, pos.z),
                    new THREE.Vector3(
                        dir.x * Math.cos(-Math.PI / 4 * i) - dir.z * Math.sin(-Math.PI / 4 * i),
                        0,
                        dir.x * Math.sin(-Math.PI / 4 * i) + dir.z * Math.cos(-Math.PI / 4 * i)
                    ), //BACK/FRONT WORK others don't
                    this.distanceBounds[0],
                    this.distanceBounds[1])
            );
        }

        //Check for intersection
        for (let i = 0; i < rays.length; i++) {
            if (this.isMoving) {
                let intersects = rays[i].intersectObjects(scene.children, true);
                //Check direction
                if (intersects.length > 0) {
                    //Front
                    if (i == 0) {
                        //console.log(rays);
                        console.log('front');
                        this.isForward = false;
                    }
                    //Front-Left
                    if (i == 1) {
                        console.log('front-left');
                        this.isForward = false;
                        this.isLeft = false;
                    }
                    //Left
                    if (i == 2) {
                        console.log('left');
                        this.isLeft = false;
                    }
                    //Back-Left
                    if (i == 3) {
                        console.log('back-left');
                        this.isBackward = false;
                        this.isLeft = false;
                    }
                    //Back
                    if (i == 4) {
                        console.log('back');
                        this.isBackward = false;
                    }
                    //Back-Right
                    if (i == 5) {
                        console.log('back-left');
                        this.isBackward = false;
                        this.isRight = false;
                    }
                    //Right
                    if (i == 6) {
                        console.log('right');
                        this.isRight = false;
                    }
                    ////Front-right
                    if (i == 7) {
                        console.log('front-right');
                        this.isForward = false;
                        this.isRight = false;
                    }
                }
            }
        }

        //Detect height changes
        let ray = new THREE.Raycaster(
            new THREE.Vector3(pos.x, pos.y - 1.5, pos.z),
            new THREE.Vector3(0, -1, 0),
            0,
            3
        );
        let o = ray.intersectObjects(scene.children, true);

        if (o.length > 0) {
            if (o[0].distance < 0.3) {
                this.controls.getObject().position.y += 0.3;
            }
            else if (o[0].distance > 0.6) {
                this.controls.getObject().position.y -= 0.3;
            }
        }

        //Move
        if (this.isForward) {
            this.controls.moveForward(this.moveSpeed);
        }
        if (this.isBackward) {
            this.controls.moveForward(-this.moveSpeed);
        }
        if (this.isRight) {
            this.controls.moveRight(this.moveSpeed / 2);
        }
        if (this.isLeft) {
            this.controls.moveRight(-this.moveSpeed / 2);
        }
        this.position.set = pos;
    }

    killed() {
        scene.remove(this);
    }
    //Generate zombie model
    instanceZombie() {
        const that = this;

        //Load zombie model
        gltfLoader
            .load(
                // resource URL
                'Models/zombie.glb',
                // called when resource is loaded
                function (object) {
                    object.scene.name = "";
                    object.scene.scale.set(that.dimensions, that.dimensions, that.dimensions);
                    //object.rotation.set(0, 0, 0);
                    object.scene.position.set(0, 0, -8);
                    that.add(object.scene);

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
