// JavaScript source code
class Player extends THREE.Object3D {
    constructor() {
        super();
        //Player properties
        this.moveSpeed = 1;
        this.isMoving = false;
        this.isForward = false;
        this.isBackward = false;
        this.isLeft = false;
        this.isRight = false;
        this.isShooting = false;
        this.isAiming = false;
        this.weaponIndex = null; //NEED WEAPON

        this.add(this.body());

        //Attach controls to the player
        this.controls = new THREE.PointerLockControls(camera, canvas);
        initControls();
    }

    body() {
        let geo = new THREE.BoxGeometry(1, 1, 1),
            mat = new THREE.MeshLambertMaterial();

        return (new THREE.Mesh(geo, mat));
    }

    //Control movement
    move() {
        if (this.isForward)
            this.controls.moveForward(this.moveSpeed);
        if (this.isBackward)
            this.controls.moveForward(-this.moveSpeed);
        if (this.isRight)
            this.controls.moveRight(this.moveSpeed);
        if (this.isLeft)
            this.controls.moveRight(-this.moveSpeed);

        this.position.set(this.controls.position);
    }

    //Toggle aiming
    aim() {

    }
}