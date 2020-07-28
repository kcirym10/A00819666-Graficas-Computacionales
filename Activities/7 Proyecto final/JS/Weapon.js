// JavaScript source code
class Weapon extends THREE.Object3D {
    constructor(weaponId, dmg, isAuto, scale) {
        super();
        this.weaponId = weaponId;
        this.dmg = dmg;
        this.isAuto = isAuto;
        this.buildWeapon(scale);
    }

    buildWeapon(scale) {
        let cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
        cube.scale.set(0.1, 0.1, scale)
        cube.position.set(0.1, -0.3, -1);

        this.add(cube);
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
                        //console.log(ancestor);
                        //scene.remove(ancestor);
                        ancestor.takeDmg(this.dmg);
                    }
                });
            }
            console.log(player.controls.getObject().position);
        }
    }
}
