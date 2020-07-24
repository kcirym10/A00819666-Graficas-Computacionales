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
    group.rotation.y += deltaX / 100;
}

/**
 * 
 * @param {number} scale
 * @param {Object3D} group
 */
function scaleScene(scale, group) {
    group.scale.set(scale, scale, scale);
}

/**
 * 
 * @param {MouseEvent} event
 * @param {Object3D} group
 */
function onMouseMove(event, group) {
    if (!isMouseDown)
        return;

    console.log(event.clientX);

    event.preventDefault();
    let deltaX = event.pageX - pageX;
    pageX = event.pageX;

    rotateScene(deltaX, group);
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
function AddEventHandlers(canvas, group) {
    canvas.addEventListener('mousemove', event => onMouseMove(event, group), false);
    canvas.addEventListener('mouseup', event => onMouseUp(event), false);
    canvas.addEventListener('mousedown', event => onMouseDown(event), false);
    $('#Add').on('click',
        (event) => {
            let obj = new Group(Math.floor(Math.random() * 6), group.children.length);
            console.log(group.children.length);
            group.add(obj);
            console.log(group);
        });
    $("#Satellite").on('click',
        (event) => {
            if (group.children.length != 0) {
                group.children[group.children.length - 1].newSatellite();
            }
        });
    $("#Clear").on('click', event => clearScene(group));
    //Slider event listener
    document.getElementById("Scale").oninput = (event) => scaleScene(event.target.value, group);
}