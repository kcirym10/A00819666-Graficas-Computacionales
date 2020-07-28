//All distances are in millions of km's
//Radius is in km's
//Information from: 
//Distances https://www.nasa.gov/sites/default/files/files/YOSS_Act1.pdf
//Sizes: https://solarsystem.nasa.gov/resources/686/solar-system-sizes/#:~:text=Outward%20from%20the%20Sun%2C%20the,than%20one%2Dfifth%20of%20Earth's.
//Pluto: https://www.nasa.gov/audience/forstudents/5-8/features/nasa-knows/what-is-pluto-58.html
//Periods: https://www.exploratorium.edu/ronh/age/
//Moons: https://solarsystem.nasa.gov/moons/overview/

//import { } from 'THREE';

//Globals
let scene = null,
    camera = null,
    renderer = null,
    controls = null,
    speedControl = 100,
    follow = false,
    following = '';

class Celestial extends THREE.Object3D {
    constructor(emmitsLight = false, radius = [], dist = [], rotationPeriod = [], orbitPeriod = [], hasMoons = false, moonCount = 0, moonPosAngle = [], textureURL = [],
        speed = 1000, angle = Math.PI / 4) {
        super();
        this.emmitsLight = emmitsLight;
        this.radius = radius;
        this.dist = dist;
        this.rotationPeriod = rotationPeriod;
        this.orbitPeriod = orbitPeriod;
        this.hasMoons = hasMoons;
        this.moonCount = moonCount;
        this.moonPosAngle = moonPosAngle;
        this.textureURL = textureURL;
        this.add(this.createCelestial());
        this.createMoon();
        this.position.set(this.dist[0], 0, -this.dist[0]);
        this.speed = speed;
        this.angle = angle;
    }

    createCelestial() {
        let geo = new THREE.SphereGeometry(this.radius[0], 100, 100),
            texture = new THREE.TextureLoader().load(this.textureURL[0]),
            bumpTexture = new THREE.TextureLoader().load(this.textureURL[1]),
            mat = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bumpTexture, bumpScale: 0.1 });

        //Only the sun emmits light
        if (this.emmitsLight) {
            texture.wrapS = THREE.ReapeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(3, 4);
            mat.emissive = new THREE.Color(1, 1, 1);
            mat.emissiveMap = texture;
            let light = new THREE.PointLight(0xffffff, 1);
            this.add(light);
        }

        let obj = new THREE.Mesh(geo, mat);

        return obj;
    }

    createMoon() {
        if (this.hasMoons)
            for (let i = 1; i <= this.moonCount; i++) {
                let moon = new Celestial(false,
                        [this.radius[i]],
                        [this.dist[i]],
                        [this.rotationPeriod[i]],
                        [this.orbitPeriod[i]],
                        false,
                        0,
                        this.moonPosAngle[i - 1],
                    [this.textureURL[i * 2], this.textureURL[i * 2 + 1]]);

                //Set moons position
                moon.position.set(this.dist[i] + this.dist[i] * Math.cos(this.moonPosAngle[i - 1]), 0, this.dist[i] + this.dist[i] * Math.sin(this.moonPosAngle[i - 1]));
                this.children[0].add(moon);
                this.add(createOrbits(this.dist[i] * 2));
            }
    }

    rotate() {
        //Rotate this and all children
        for (let i = this.children[0].children.length - 1; i >= 0; i--)
            this.children[0].children[i].rotation.y += this.rotationPeriod[i + 1] / this.speed;
        this.children[0].rotation.y += (speedControl / 10) / this.speed / this.rotationPeriod[0];
    }
    orbit() {
        for (let i = this.children[0].children.length - 1; i >= 0; i--) {
            let child = this.children[0].children[i];

            if (child) {
                child.moonPosAngle += (speedControl / 10) / this.speed / child.orbitPeriod[0];
                child.position.x = 2 * child.dist[0] * Math.cos(child.moonPosAngle);
                child.position.z = - 2 * child.dist[0] * Math.sin(child.moonPosAngle);
            }
        }

        this.angle += speedControl / this.speed / this.orbitPeriod[0];
        this.position.x = 2 * this.dist[0] * Math.cos(this.angle);
        this.position.z = - 2 * this.dist[0] * Math.sin(this.angle);
        return;
    }
}

class AsteriodBelt extends THREE.Object3D {
    constructor(dist = 0, asteroidCount = 0) {
        super();
        this.speed = 1000;
        this.orbitPeriod = 2000;
        this.dist = dist;
        this.asteroidCount = asteroidCount;
        this.offset = 2 * Math.PI / asteroidCount;
        this.textureURL = 'Materials/moon-texture.jpg';
        this.createAsteroids();
    }

    getPosition(i) {
        return [-4 + 8 * Math.random() + (2 * this.dist * Math.cos(this.offset * i)), -4 + Math.random() * 8, -4 + 8 * Math.random() + (2 * this.dist * Math.sin(this.offset * i))];
    }

    createAsteroids() {
        let geo = new THREE.SphereGeometry(Math.random() * 2 + 1, 20, 20),
            texture = new THREE.TextureLoader().load(this.textureURL),
            mat = new THREE.MeshLambertMaterial({ map: texture });

        for (let i = 0; i < this.asteroidCount; i++) {
            let obj = new THREE.Mesh(geo, mat);

            let pos = this.getPosition(i);
            obj.position.set(pos[0], pos[1], pos[2]);

            this.add(obj);
        }
    }

    rotate() {
        this.rotation.y += speedControl / this.speed  / this.orbitPeriod;
    }
    orbit() {
        return;
    }
}

// JavaScript source code
function initCanvas() {
    let canvas = document.getElementById('myCanvas');

    if (!canvas)
        return;

    return canvas;
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
function initScene(canvas) {
    //Create scene
    scene = new THREE.Scene();
    scene.background - new THREE.Color(0.2, 0.2, 0.2);

    //Create perspective camera
    camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 10000);
    //camera.position.set(Earth.position.x, 1000, 500);
    camera.position.set(0, 1000, 700);
    scene.add(camera);

    //Ambient light for testing
    let light = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(light);

    //Create WebGLRenderer and bind to the canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);

    //Create OrbitControls
    controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();
}

function createOrbits(dist) {
    let orbit = new THREE.TorusGeometry(dist, 0.05, 8, 400),
        mat = new THREE.MeshLambertMaterial({ emissive: new THREE.Color(1, 1, 1) }),
        ring = new THREE.Mesh(orbit, mat);

    ring.rotation.x = Math.PI / 2;
    return ring;
}

$(document).ready(
    function () {
        let canvas = initCanvas(),
            solarSystem = new THREE.Object3D,
            sunRad = 696.340,
            unkownRP = 0.00001, //Unkown rotation period
            moonOffset = Math.PI / 8; //In case any moons may overlap

            let CelBodies = {
                Sun: new Celestial(true, [sunRad], [0], [27], [0], false, 0, [], ['Materials/sun-texture.jpg', 'Materials/sun-texture.jpg']),
                Mercury: new Celestial(false, [2.440], [sunRad + 57], [58.6], [87.97], false, 0, [], ['Materials/mercury-texture.jpg', 'Materials/mercury-bump.jpg']),
                Venus: new Celestial(false, [6.052], [sunRad + 108], [243], [224.7], false, 0, [], ['Materials/venus-texture.jpg', 'Materials/venus-bump.jpg']),
                //1 Moon
                Earth: new Celestial(false, [6.371, 1.737], [sunRad + 149, 6.755], [0.99, 27], [365.26, 29], true, 1,
                    [0], ['Materials/earth-texture.jpg', 'Materials/earth-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg']),
                //2 Moons
                Mars: new Celestial(false, [3.390, 0.0125, 0.13], [sunRad + 228, 6.00, 4.64], [1.03, unkownRP, unkownRP], [686.2, 0.8, 0.125], true, 2,
                    [0, moonOffset], ['Materials/mars-texture.jpg', 'Materials/mars-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg',
                        'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg']),
                AstBelt: new AsteriodBelt(sunRad + 400, 1000),
                AstBelt2: new AsteriodBelt(sunRad + 405, 1000),
                AstBelt3: new AsteriodBelt(sunRad + 410, 1000),
                AstBelt4: new AsteriodBelt(sunRad + 415, 1000),
                AstBelt5: new AsteriodBelt(sunRad + 420, 1000),
                AstBelt6: new AsteriodBelt(sunRad + 425, 1000),
                //53 Moons - ONLY adding 4
                //Io, Europa
                Jupiter: new Celestial(false,
                    [69.911, 2.00, 1.593, 1.593, 1.593, 1.593, 1.593, 1.593, 0.582],
                    [sunRad + 780, 70.173, 71.582, 73.582, 74.582, 76.582, 78.582, 79.582, 80.582],
                    [0.41, unkownRP, unkownRP * 2, unkownRP, unkownRP * 2, unkownRP, unkownRP, unkownRP * 2, unkownRP * 2],
                    [4328.9, 1.75, 0.146, 0.146, 0.146, 0.1, 0.06, 0.046, 0.0146], true, 8,
                    [0, moonOffset, moonOffset * 2, moonOffset * 3, moonOffset * 4, moonOffset * 5, moonOffset * 6, moonOffset * 7],
                    ['Materials/jupiter-texture.jpg', 'Materials/jupiter-bump.jpg', 'Materials/io-moon-texture.jpg', 'Materials/io-moon-texture.jpg', 'Materials/io-moon-texture.jpg',
                        'Materials/io-moon-texture.jpg', 'Materials/io-moon-texture.jpg', 'Materials/io-moon-texture.jpg', 'Materials/io-moon-texture.jpg', 'Materials/io-moon-texture.jpg',
                        'Materials/moon-bump.jpg', 'Materials/europa-moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-bump.jpg',
                        'Materials/moon-bump.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-bump.jpg']),
                Saturn: new Celestial(false,
                    [58.232, 2.00, 1.593, 1.593, 1.593, 1.593, 1.593, 1.593, 0.582],
                    [sunRad + 1437.70, 71.582, 63.582, 64.582, 66.582, 68.582, 69.582, 70.582],
                    [0.45, unkownRP, unkownRP * 2, unkownRP, unkownRP * 2, unkownRP, unkownRP, unkownRP * 2, unkownRP * 2],
                    [10752.9, 100.75, 0.146, 0.146, 0.146, 0.1, 0.06, 0.046, 0.0146], true, 7,
                    [0, moonOffset, moonOffset * 2, moonOffset * 3, moonOffset * 4, moonOffset * 5, moonOffset * 6, moonOffset * 7],
                    ['Materials/saturn-texture.jpg', 'Materials/saturn-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg',
                        'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg',
                        'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg']),
                Uranus: new Celestial(false,
                    [25.362, 1.5, 2, 4],
                    [sunRad + 2871, 35, 40, 50],
                    [0.72, unkownRP, unkownRP, unkownRP],
                    [30663.65, 100, 30, 10], true, 3,
                    [0, moonOffset, moonOffset * 2, moonOffset * 3, moonOffset * 4, moonOffset * 5, moonOffset * 6, moonOffset * 7],
                    ['Materials/uranus-texture.jpg', 'Materials/uranus-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg',
                        'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg']),
                Neptune: new Celestial(false,
                    [24.622, 0.5, 0.25, 0.7],
                    [sunRad + 4530, 30, 32, 33],
                    [0.67, unkownRP, unkownRP, unkownRP],
                    [60148.35, 20, 10, 15], true, 3,
                    [0, moonOffset, moonOffset * 2, moonOffset * 3, moonOffset * 4, moonOffset * 5, moonOffset * 6, moonOffset * 7],
                    ['Materials/neptune-texture.jpg', 'Materials/pluto-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg',
                        'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg']),
                Pluto: new Celestial(false,
                    [1.188, 0.7, 0.2, 0.4],
                    [sunRad + 5925, 4, 7, 8],
                    [6.39, unkownRP, unkownRP, unkownRP],
                    [90735.35, 20, 4, 15], true, 3,
                    [moonOffset, moonOffset * 2, moonOffset * 3],
                    ['Materials/pluto-texture.jpg', 'Materials/pluto-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg', 'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg',
                        'Materials/moon-texture.jpg', 'Materials/moon-bump.jpg'])
            };

        initScene(canvas);

        scene.add(solarSystem);

        for (body in CelBodies) {
            solarSystem.add(CelBodies[body]);
            solarSystem.add(createOrbits(CelBodies[body].dist[0]*2));
        }
        //console.log(CelBodies['Earth'].children[0])

        run(CelBodies);
    }
)

function animate(CelBodies) {
    for (body in CelBodies) {
        CelBodies[body].rotate();
        if (body !== 'Sun')
            CelBodies[body].orbit();
    }
}

function run(CelBodies) {
    requestAnimationFrame(() => run(CelBodies));
    follow = false;
    following = 'Pluto';
    if (follow) {
        camera.position.set(CelBodies[following].position.x - CelBodies[following].radius[0] * 2,
            CelBodies[following].position.y + CelBodies[following].radius[0],
            CelBodies[following].position.z);
        controls.target = CelBodies[following].position;
    }
    controls.update();

    animate(CelBodies);

    renderer.render(scene, camera);
}