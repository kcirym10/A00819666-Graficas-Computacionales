

// JavaScript source code
class Player extends THREE.Object3D {
    constructor() {
        super();
        //Player properties
        this.health = 100;
        this.moveSpeed = 0.2;
        this.isMoving = false;
        this.isForward = false;
        this.isBackward = false;
        this.isLeft = false;
        this.isRight = false;
        this.isShooting = false;
        this.weapons = [weapons[0], weapons[1]];
        this.activeWeapon = 0;
        this.weapons[0].visible = true;
        this.weapons[1].visible = false;
        this.add(weapons[0]);
        this.add(weapons[1]);
        this.dmgDelay = 1000;
        this.lastDamaged = performance.now();
        this.points = 500;
        this.score = [0, 500];
        this.buy = false;

        console.log(this.weapons);

        //Collision bounds
        this.distanceBounds = [ 0.01, 0.5 ];

        //Crosshair
        this.createCrosshair();
        

        //Attach controls to the player
        this.controls = new THREE.PointerLockControls(camera, canvas);
    }

    //Called every frame
    update() {
        //Called every frame to detect when player takes damage
        this.move();

        //Aiming not implemented
        //if (this.isAiming)
        //    this.aim();

        if (this.isShooting)
            player.shoot();
    }

    createCrosshair() {
        let n = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.0002, 0.0002), new THREE.MeshBasicMaterial());
        n.position.set(0, 0, -0.2);
        n.name = "Crosshair";
        this.add(n);

        let m = n.clone();
        m.rotation.set(0, Math.PI / 2, Math.PI / 2);
        m.name = 'Crosshair';
        this.add(m);
    }

    //Control movement
    move() {
        //Check for collision
        let rays = [];
        let pos = this.controls.getObject().position,
            dir = this.controls.getDirection(new THREE.Vector3).clone();

        //Create rays around player
        for (let i = 0; i < 8; i++) {
            rays.push(
                new THREE.Raycaster(new THREE.Vector3(pos.x, 1.0, pos.z),
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
            let intersects = rays[i].intersectObjects(scene.children, true);
                
            //Check direction
            if (intersects.length > 0) {
                    //If zombie then lose health
                let found = false;

                intersects[0].object.traverseAncestors((anc) => {
                    if (!found && anc.name === 'Zombie') {
                        this.takeDmg();
                        found = true;
                    }
                });
                if (found) {
                    intersects[0].object.position.x -= 0.5;
                    intersects[0].object.position.z -= 0.5;
                }

                if (intersects[0].distance <= 0.3)
                    if (this.isMoving) {
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

        ////Detect height changes
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
        if (this.isMoving) {
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
    }

    //Shoot gun
    shoot() {
        //Call the active weapon's method
        this.weapons[this.activeWeapon].shoot();

        //If it is not an automatic weapon
        if (!this.weapons[this.activeWeapon].isAuto)
            this.isShooting = false;
    }

    weaponChange() {
        if (this.activeWeapon === 0) {
            this.weapons[0].visible = true;
            this.weapons[1].visible = false;
        }
        else {
            this.weapons[1].visible = true;
            this.weapons[0].visible = false;
        }
        document.getElementById('Ammo').innerHTML = `${this.weapons[this.activeWeapon].clip} / ${this.weapons[this.activeWeapon].ammoCount}`
    }

    takeDmg() {
        let now = performance.now();

        //Only take damage with a difference of 1s
        if (now - this.lastDamaged >= this.dmgDelay) {
            this.health -= 20;
            document.getElementById('Health').innerHTML = 'Health: ' + this.health;
            this.lastDamaged = now;
            //Set a red tint as you get more hurt
            document.getElementById('Overlay').style.backgroundColor = `rgba(${100 - this.health}, 0, 0, 0.3)`;

            if (this.health === 0) {
                game.gameOver();
            }
        }
    }

    reload() {
        player.weapons[this.activeWeapon].reload();
    }
}