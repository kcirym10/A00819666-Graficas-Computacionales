///<reference path="../libs/three.js/three.module.js" />
import { Object3D } from '../libs/three.js/three.module.js';
/*
    Needed handlers
    Range change
    Mouse down
    Mouse up
    Mouse move
 */

/** 
 *  @type {boolean} 
 *  @type {number}
 */
let isMouseDown = false, pageX = 0;

/**
 * 
 * @param {number} deltaX
 * @param {Object3D} group
 */
function rotateScene(deltaX, group) {
    
}

/**
 * 
 * @param {number} scale
 * @param {Object3D} group
 */
function scaleScene(scale, group) {

}

/**
 * 
 * @param {MouseEvent} event
 * @param {Object3D} group
 */
function onMouseMove(event, group) {
    if (!isMouseDown)
        return;

    event.preventDefault();
    let deltaX = event.pageX - pageX;
    pageX = event.pageX;
    
}

/**
 * 
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
    event.preventDefault();

    isMouseDown = true;
    pageX = event.pageX;
}

/**
 * 
 * @param {MouseEvent} event
 */
function onMouseUp(event) {
    event.preventDefault();

    isMouseDown = false;
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 * @param {Object3D} group
 */
export function AddEventHandlers(canvas, group) {
    canvas.addEventListener('mousemove', event => onMouseMove(event, group), false);
    canvas.addEventListener('mouseup', event => onMouseUp(event), false);
    canvas.addEventListener('mousedown', event => onMouseDown(event), false);
}