// JavaScript source code
class Weapon extends THREE.Object3D {
    constructor(weaponId, dmg, isAuto, scale, name, ammoCount, clipSize, fillPrice, shotInterval, dmgDivider) {
        super();
        this.weaponId = weaponId;
        this.dmg = dmg;
        this.isAuto = isAuto;
        this.name = name;
        this.ammo = ammoCount;
        this.ammoCount = ammoCount;
        this.clipSize = clipSize;
        this.clip = clipSize;
        this.fillPrice = fillPrice;
        this.shotInterval = shotInterval;
        this.lastShot = performance.now();
        this.isFull = true;
        this.dmgDivider = dmgDivider;

        //Load weapon
        this.buildWeapon(scale);
    }

    buildWeapon(scale) {
        const that = this;

        //Load zombie model
        gltfLoader
            .load(
                // resource URL
                `Models/${this.name}.glb`,
                // called when resource is loaded
                function (object) {
                    if (that.name === 'pistol') {
                        object.scene.scale.set(0.005, 0.005, scale);
                        object.scene.rotation.y = Math.PI;
                        object.scene.position.set(0.5, -0.6, -2);
                    }
                    else {
                        object.scene.scale.set(scale, 0.1, 0.1);
                        object.scene.rotation.y = -Math.PI / 2;
                        object.scene.position.set(0.15, -0.2, -0.35);
                    }
                    object.scene.rotation.x = Math.PI / 16;
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

    shoot() {
        let now = performance.now();

        if (this.clip > 0 && now - this.lastShot >= this.shotInterval) {
            this.lastShot = now;
            let ray = new THREE.Raycaster(this.getWorldPosition(new THREE.Vector3()), player.controls.getDirection(new THREE.Vector3(0, 0, 0).clone()), 0.01, 1000);

            //Interacts recursively with all geometries
            let objs = ray.intersectObjects(scene.children, true);

            //If gunshot hit
            if (objs.length > 0) {
                let found = false;

                if (objs.length > 4 && objs[4].object.name === 'Map') {
                    found = true;
                }

                if (!found)
                    for (let i = 0; i < objs.length && !found; i++) {
                        objs[i].object.traverseAncestors((ancestor) => {
                        

                            if (!found && ancestor.name === 'Zombie') {
                                found = true;
                                ancestor.takeDmg(this.dmg);
                            }
                        });
                    }
            }

            --this.clip;
            this.isFull = false;

            document.getElementById('Ammo').innerHTML = `${this.clip} / ${this.ammoCount}`
        }
        else if (this.clip === 0)
            this.reload();

        if (!this.isAuto)
            player.isShooting = false;
    }

    reload() {
        if (this.ammoCount > 0 && this.clip < this.clipSize) {
            if (this.ammoCount >= this.clipSize) {
                this.ammoCount -= this.clipSize - this.clip;
                this.clip = this.clipSize;
            }
            else {
                this.clip += this.ammoCount;
                this.ammoCount = 0;
            }

            document.getElementById('Ammo').innerHTML = `${this.clip} / ${this.ammoCount}`
        }
    }

    fill() {
        this.isFull = true;
        this.clip = this.clipSize;
        this.ammoCount = this.ammo;
        document.getElementById('Ammo').innerHTML = `${this.clip} / ${this.ammoCount}`;
    }
}
