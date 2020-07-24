//import * as THREE from 'THREE';

/**
 * @type {THREE.WebGLRenderer}
 * @type {THREE.Scene}
 * @type {THREE.PerspectiveCamera}
 */
let renderer = null,
    scene = null,
    camera = null;


class Group extends THREE.Object3D{
    constructor(geoIndex, position) {
        super();
        this.position.set((Math.random() + 1) * 5, 0, -position * 5);
        this.geoIndex = geoIndex;
        this.rotationSpeed = Math.random() * 0.07;
        this.add(this.newObject());
    }

    randomGeometry(index) {
        
        let mat = new THREE.MeshLambertMaterial();
        let geo = null;

        switch (index) {
            //Cube
            case 0: {
                geo = new THREE.BoxGeometry(1, 1, 1);
                break;
            }
            //Cone
            case 1: {
                geo = new THREE.ConeGeometry(1, 1, 20);
                break;
            }
            //Cilinder
            case 2: {
                //Random cilinders
                let radTop = Math.random() + 0.2, radBottom = Math.random() + 0.2;
                geo = new THREE.CylinderGeometry(radTop, radBottom, 1, 20);
                break;
            }
                //Dodecahedron
            case 3: {
                geo = new THREE.DodecahedronGeometry(0.5);
                break;
            }
            //Icosahedron
            case 4: {
                geo = new THREE.IcosahedronGeometry(0.5);
                break;
            }
            //Sphere
            case 5: {
                geo = new THREE.SphereGeometry(0.5, 20, 20);
                break;
            }
        }

        return new THREE.Mesh(geo, mat);
    }

    newObject() {
        let obj = this.randomGeometry(this.geoIndex);

        return obj;
    }

    newSatellite() {
        let obj = this.randomGeometry(Math.floor(Math.random() * 6));
        let random = Math.random() * 2;
        if (random >= 1)
            obj.position.set(0, -(Math.random() + 1) * 1.5, (Math.random() + 1) * 1.5);
        else
            obj.position.set(0, -(Math.random() + 1) * 1.5, -(Math.random() + 1) * 1.5);
        this.add(obj);
    }
}


/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
function initCanvas(canvas) {
    canvas = document.getElementById('myCanvas');

    if (!canvas) {
        console.log('No canvas found');
        return;
    }
    return canvas;
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
function initScene(canvas) {
    //Create the THREE.js renderer and attach it to the canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);

    //Create a THREE.js scene
    scene = new THREE.Scene();
    scene.background - new THREE.Color(0.2, 0.2, 0.2);

    //Create a new camera and add it to the scene.
    //A new projection matrix is created from these values
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
    camera.position.y = 25;
    camera.position.z = 50;
    camera.lookAt(0, 0, 0);

    //Add lights to view the scene
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let directLight = new THREE.DirectionalLight(0xff00ff, 0.7);
    directLight.position.set(0, 2, 100);
    directLight.target.position.set(0, -2, 5);
    scene.add(directLight);


    //Attach the camera to the scene
    scene.add(camera);
}

/**
 * 
 * @param {THREE.Object3D} obj
 */

function clearScene(group) {
    while (group.children.length > 0) {
        group.remove(group.children[group.children.length - 1]);
    }
    console.log(group);
}

$(document).ready(
    function () {
        let canvas = null,
            container = new THREE.Object3D;

        //Get canvas and set context
        canvas = initCanvas(canvas);
        //Create camera, scene and renderer
        initScene(canvas);

        scene.add(container);

        //console.log(container);
        run(container);

        AddEventHandlers(canvas, container);
    }
);

/**
 * 
 * @param {THREE.Object3D} group
 */
function animate(group) {
    group.children.forEach(child => {
        //child.rotation.y += child.rotationSpeed;
        child.rotation.x += child.rotationSpeed;
    })
    group.rotation.y += 0.01;
}

function run(group) {
    requestAnimationFrame(function () { run(group); });

    //Render the scene
    renderer.render(scene, camera);

    animate(group);
}