// JavaScript source code

class Game {
    constructor() {
        this.spawnedZombies = 0;
        this.paused = true;
        this.isNewGame = true;
        this.round = 0;
        this.zombiesPerRound = 11;
        this.zombiesLeft = 0;
        this.activeZombies = 0;

        //Get zombie model
        this.zombieModel = this.getZombieModel();

        //Spawn zombies into game
        this.spawnAreas = [
            new THREE.Vector3(0, 0, -50),       //North
            new THREE.Vector3(50, 0, 0),        //East
            new THREE.Vector3(0, 0, 50),        //South
            new THREE.Vector3(-50, 0, 0)        //West
        ];

        this.activeSpawns = 4;
        this.spawnDelay = 1000; //ms
        this.roundDelay = 0;
        this.roundTimer = 0;
        this.spawnTimer = performance.now();
        this.elapsed = 0;
        this.zombies = [];
        //Spawn a new player
        this.player = this.spawnPlayer();

        this.loadGameArea();
        initControls();
    }

    loadGameArea() {
        //Build game area
        let geo = new THREE.TorusGeometry(50, 10, 5, 100, 2 * Math.PI),
            mat = new THREE.MeshLambertMaterial(),
            mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        scene.add(mesh);


        //Reuse the same variables to create more geometry
        //Create visual barriers
        mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 2), new THREE.MeshLambertMaterial());
        mesh.position.z = -10;
        scene.add(mesh);
    }

    togglePause() {
        this.paused = !this.paused;
        //Change necesaries
        //if (this.paused) {
        //    canvas.hidden = true;
        //}
        //else {
        //    canvas.hidden = false;
        //}
    }

    newGame() {
        this.spawnPlayer();
    }

    getZombieModel() {
        let zombie = new Zombie();

        zombie.position.set(0, -10, 0);

        scene.add(zombie);

        return zombie;
    }

    spawnPlayer() {
        player = new Player();
        camera.add(player);
        return player;
    }
    spawnZombie() {

        let time = performance.now();

        if (time - this.spawnTimer >= this.spawnDelay) {
            //console.log(time - this.spawnTimer);

            let zombie = this.zombieModel.clone();
            let pos = this.spawnAreas[Math.floor(Math.random() * this.activeSpawns)];

            zombie.name = "Zombie";
            zombie.position.set(pos.x, pos.y, pos.z);

            scene.add(zombie);

            ++this.activeZombies;
            this.zombies.push(zombie);
            ++this.spawnedZombies;

            this.spawnTimer = performance.now();

            console.log(zombie);
        }
    }
    newRound() { 
        this.spawnedZombies = 0;
        this.zombiesLeft = this.zombiesPerRound;
        this.activeZombies = 0;
        ++this.round;
        document.getElementById('Round').innerHTML = "Round: " + this.round;
    }

    update() {
        if (!this.paused) {
            //Starts a new round
            if (this.zombiesLeft === 0) {
                this.newRound();
                this.roundTimer = performance.now();
            }

            if (this.spawnedZombies < this.zombiesPerRound && this.activeZombies < 10 && this.zombiesLeft <= this.zombiesPerRound && performance.now() - this.roundTimer >= this.roundDelay) {
                this.spawnZombie();
            }

            for (let i = 0; i < this.zombies.length; i++)
                this.zombies[i].update();
        }
    }

    gameOver() {
        this.paused = true;
        let gameOver = document.getElementById('GameOver');

        gameOver.style.visibility = "visible";
    }
}
