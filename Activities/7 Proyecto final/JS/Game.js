// JavaScript source code

class Game {
    constructor() {
        this.spawnedZombies = 0;
        this.paused = true;
        this.loading = false;
        this.round = 0;
        this.zombiesPerRound = 10;
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
        this.roundDelay = 3000;
        this.roundTimer = 0;
        this.spawnTimer = performance.now();
        this.elapsed = 0;
        this.zombies = [];
        this.zombieCollection = [];
        this.ammoCrate = null;
        this.sound = new THREE.Audio(listener);

        //Spawn a new player
        this.player = this.spawnPlayer();

        this.loadGameArea();
        initControls();
    }

    loadGameArea() {
        let that = this;

        //Load round sounds
        //Round change from COD Zombies
        let audioLoader = new THREE.AudioLoader();
        audioLoader.load(`Audio/round-start.mp3`, function (buffer) {
            that.sound.setBuffer(buffer);
            that.sound.setLoop(false);
            that.sound.setVolume(0.5);
            that.sound.offset = 0;
            that.sound.playbackRate = 1;
        });

        //Build game area

        //Surrounding wall
        let texture = new THREE.TextureLoader().load('./Textures/overgrown-wall.jpg'),
            geo = new THREE.TorusGeometry(50, 10, 5, 100, 2 * Math.PI),
            mat = new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 1.0 }),
            mesh = new THREE.Mesh(geo, mat);

        texture.wrapS = THREE.ReapeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(500, 100);

        mesh.rotation.x = Math.PI / 2;
        mesh.name = "Map";
        scene.add(mesh);


        //Reuse the same variables to create more geometry
        //Group for house
        let house = new THREE.Object3D();
        let light,
            lightColor = new THREE.Color(0.3, 0.3, 0),
            lightAngle = Math.PI / 8,
            penumbra = 0.1,
            decay = 2;

        //Texture for house pillars
        texture = new THREE.TextureLoader().load('./Textures/concrete.jpg');
        texture.wrapS = THREE.ReapeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 10);

        //Front right pillar
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 0.2), new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 0.5 }));
        mesh.name = "Map";
        mesh.position.set(5, 2, -5);
        house.add(mesh);
        //Light
        light = new THREE.SpotLight(lightColor, 1, 50, lightAngle, penumbra, decay);
        light.position.set(5, 4, -5);
        light.target.position.set(25, 2, -25);
        house.add(light.target);
        house.add(light);

        //Front left pillar
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 0.2), new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 0.5 }));
        mesh.name = "Map";
        mesh.position.set(-5, 2, -5);
        house.add(mesh);
        //Light
        light = new THREE.SpotLight(lightColor, 1, 50, lightAngle, penumbra, decay);
        light.position.set(-5, 4, -5);
        light.target.position.set(-25, 2, -25);
        house.add(light.target);
        house.add(light);

        //Back right pillar
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 0.2), new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 0.5 }));
        mesh.name = "Map";
        mesh.position.set(5, 2, 5);
        house.add(mesh);
        //Light
        light = new THREE.SpotLight(lightColor, 1, 50, lightAngle, penumbra, decay);
        light.position.set(5, 4, 5);
        light.target.position.set(25, 2, 25);
        house.add(light.target);
        house.add(light);

        //Back left pillar
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 0.2), new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 0.5 }));
        mesh.name = "Map";
        mesh.position.set(-5, 2, 5);
        house.add(mesh);
        //Light
        light = new THREE.SpotLight(lightColor, 1, 50, lightAngle, penumbra, decay);
        light.position.set(-5, 4, 5);
        light.target.position.set(-25, 2, 25);
        house.add(light.target);
        house.add(light);

        //Roof
        texture = new THREE.TextureLoader().load('./Textures/palm.png');
        texture.wrapS = THREE.ReapeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(30, 30);

        mesh = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 10.5), new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 0.5 }));
        mesh.position.y = 4;
        house.add(mesh);
        //Roof light
        light = new THREE.SpotLight(lightColor, 1, 50, lightAngle * 3, 0.5, decay);
        light.position.set(0, 4, 0);
        house.add(light);

        //Ammo crate
        mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), new THREE.MeshPhongMaterial());
        mesh.position.set(0, 0.5, 0);
        house.add(mesh);
        this.ammoCrate = mesh;

        house.rotation.y = Math.PI / 4;
        scene.add(house);

        //Create pillars
        texture = new THREE.TextureLoader().load('./Textures/wood-pillar.jpg');
        texture.wrapS = THREE.ReapeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 30);

        texture.emissive = new THREE.Color(1, 1, 1);
        texture.emissiveMap = texture;

        for (let i = 0; i < 100; i++) {
            let rad = Math.random() + 0.5;
            mesh = new THREE.Mesh(
                new THREE.CylinderGeometry(rad, rad, Math.random() * 40 + 10, Math.random() * 5 + 10, 1),
                new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 0.5 })
            );

            //Determine tree positioning
            let side = Math.floor(Math.random() * 4);

            //North
            if (side === 0) {
                mesh.position.x = -30 + Math.random() * 90;
                mesh.position.z = -30 + Math.random() * 20;
            }
            //South
            else if (side === 1) {
                mesh.position.x = 30 - Math.random() * 90;
                mesh.position.z = 30 - Math.random() * 20;
            }
            //East
            else if (side === 2) {
                mesh.position.x = 30 - Math.random() * 20;
                mesh.position.z = -30 + Math.random() * 90;
            }
            //West
            else {
                mesh.position.x = -30 + Math.random() * 20;
                mesh.position.z = 30 - Math.random() * 90;
            }

            scene.add(mesh);
        }

    }

    newGame() {
        this.spawnPlayer();
        document.getElementById('Ammo').innerHTML = `${player.weapons[0].clip} / ${player.weapons[0].ammoCount}`
        document.getElementById('Points').innerHTML = player.points;

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

    //Spawn zombies per round
    spawnZombie() {
        //Spawn position
        let pos = this.spawnAreas[Math.floor(Math.random() * this.activeSpawns)];

        if (this.round === 1) {
            let time = performance.now();

            if (time - this.spawnTimer >= this.spawnDelay) {

                let zombie = this.zombieModel.clone();

                zombie.name = "Zombie";
                zombie.position.set(pos.x, pos.y, pos.z);

                scene.add(zombie);

                ++this.activeZombies;
                this.zombies.push(zombie);
                ++this.spawnedZombies;

                this.spawnTimer = performance.now();
            }
        }
        else {
            let time = performance.now();

            if (time - this.spawnTimer >= this.spawnDelay) {

                //Active zombies
                //Number of zombies currently alive
                ++this.activeZombies;
                //Spawned zombies
                //How many zombies have been spawned this round
                ++this.spawnedZombies;

                //Add to active zombies
                let zombie = this.zombieCollection[this.zombieCollection.length - 1];

                this.zombies.push(zombie);

                zombie.position.set(pos.x, pos.y, pos.z);
                zombie.isAlive = true;
                zombie.health = 100;
                //Increase health 10 percent every round
                zombie.health += zombie.health * game.round * 0.10;
                if (zombie.speed < 0.1)
                    zombie.speed += 0.01;
                zombie.visible = true;

                //Remove from the zombie collection
                this.zombieCollection.pop();

                this.spawnTimer = performance.now();
            }
        }
    }

    //Start new round
    newRound() { 
        this.sound.play();
        this.spawnedZombies = 0;
        this.zombiesLeft = this.zombiesPerRound;
        this.activeZombies = 0;
        ++this.round;
        document.getElementById('Round').innerHTML = "Round: " + this.round;
    }

    //Update all entities external to player
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

            let pos = player.controls.getObject().position;

            if (pos.x <= 1.5 && pos.x >= -1.5 && pos.z <= 1.5 && pos.z >= -1.5) {
                let purchase = document.getElementById('Purchase');
                //Show
                purchase.style.visibility = 'visible';
                purchase.innerHTML = `Purchase ammo ${player.weapons[player.activeWeapon].fillPrice}`

                if (player.buy && player.points >= player.weapons[player.activeWeapon].fillPrice) {
                    if (!player.weapons[player.activeWeapon].isFull &&
                        player.weapons[player.activeWeapon].ammo != (player.weapons[player.activeWeapon].ammoCount + player.weapons[player.activeWeapon].clip)) {
                        player.weapons[player.activeWeapon].fill();
                        player.points -= player.weapons[player.activeWeapon].fillPrice;
                        document.getElementById('Points').innerHTML = `${player.points}`;
                    }
                }
                player.buy = false;
            }
            else {
                player.buy = false;
                document.getElementById('Purchase').style.visibility = 'hidden';
            }
        }
    }

    gameOver() {
        this.paused = true;
        let gameOver = document.getElementById('GameOver');

        player.controls.unlock();

        gameOver.style.visibility = "visible";

        document.getElementById('pauseScreen').style.visibility = 'hidden';
        document.getElementById('start').style.visibility = 'hidden';
        let pick = document.getElementById('Pickup');
        pick.style.visibility = 'visible';
        pick.innerHTML = `Points: ${player.score[1]}<br>Kills: ${player.score[0]}`;
    }
}
