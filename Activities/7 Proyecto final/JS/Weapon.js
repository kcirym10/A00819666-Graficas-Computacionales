// JavaScript source code
class Weapon extends THREE.Object3D {
    constructor(weaponId, dmg, isAuto, scale, name, ammoCount, clipSize) {
        super();
        this.weaponId = weaponId;
        this.dmg = dmg;
        this.isAuto = isAuto;
        this.buildWeapon(scale);
        this.name = name;
        this.ammoCount = ammoCount;
        this.clipSize = clipSize;
        this.clip = clipSize;
    }

    buildWeapon(scale) {
        const that = this;

        //Load zombie model
        gltfLoader
            .load(
                // resource URL
                `Models/pistol.glb`,
                // called when resource is loaded
                function (object) {
                    object.scene.scale.set(0.005, 0.005, scale);
                    object.scene.position.set(0.5, -0.6, -2);
                    object.scene.rotation.y = Math.PI;
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

        /*let cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
        cube.scale.set(0.1, 0.1, scale)
        cube.position.set(0.1, -0.3, -1);

        this.add(cube);*/
    }

    shoot() {
        let ray = new THREE.Raycaster(this.getWorldPosition(new THREE.Vector3()), player.controls.getDirection(new THREE.Vector3(0, 0, 0).clone()), 0.01, 1000);

        //Interacts recursively with all geometries
        let objs = ray.intersectObjects(scene.children, true);

        if (objs.length > 0) {
            let found = false;
            //console.log(objs[0].object);
            for (let i = 0; i < objs.length && !found; i++) {
                objs[i].object.traverseAncestors((ancestor) => {
                    if (ancestor.name === 'Map') {
                        found = true;
                        console.log(ancestor);
                    }

                    if (!found && ancestor.name === 'Zombie') {
                        found = true;
                        console.log(ancestor);
                        ancestor.takeDmg(this.dmg);
                    }
                });
            }
        }

        --this.clip;
    }

    reload() {
        this.ammoCount -= this.clipSize - this.clip;
    }
}
