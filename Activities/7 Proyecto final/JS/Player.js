// JavaScript source code
class Player extends THREE.Object3D {
    constructor() {
        super();
        //Player properties
        this.moveSpeed = 0.1;
        this.isMoving = false;
        this.isForward = false;
        this.isBackward = false;
        this.isLeft = false;
        this.isRight = false;
        this.isShooting = false;
        this.isAiming = false;
        this.weaponIndex = null; //NEED WEAPON

        //this.add(this.body());

        //Attach controls to the player
        this.controls = new THREE.PointerLockControls(camera, canvas);
        initControls();

        this.direction = [new THREE.Vector3(0, 0, 1)];
        this.rays = this.setRays();
    }

    setRays() {
        let rays = [];
        for (let i = 0; i < 2 * Math.PI; i += Math.PI / 4) {
            rays.push(new THREE.Raycaster(new THREE.Vector3(this.position.x, 1.5, this.position.z), new THREE.Vector3(0, i, 0), 0.1, 0.2));
        }
        return rays;
    }

    body() {
        let geo = new THREE.BoxGeometry(100, 100, 100),
            mat = new THREE.MeshLambertMaterial();

        return (new THREE.Mesh(geo, mat));
    }

    //Control movement
    move() {
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].ray.origin.copy(this.position);
            this.rays[i].ray.origin.y = -0.1;
            //let direction = this.controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
            //console.log(direction);
        }
        //Get movement direction from controls
        
        

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

        this.position.set(camera.position.x, 0, camera.position.z);
    }

    //Shoot gun
    shoot() {

    }

    //Toggle aiming
    aim() {

    }
}