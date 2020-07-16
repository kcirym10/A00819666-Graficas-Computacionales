import * as three from '../libs/three.js/three.js';
import { AddEventHandlers } from './eventHandlers.js';

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
    alert('success');
}

/**
 * 
 * @param {three.Renderer} renderer
 * @param {three.Scene} scene
 * @param {three.PerspectiveCamera} camera
 */
function initScene(renderer, scene, camera) {

}

$(document).ready(
    function () {
        let canvas = null,
            renderer = null,
            scene = null,
            camera = null;

        initCanvas(canvas);

        AddEventHandlers(canvas, group);
    }
);