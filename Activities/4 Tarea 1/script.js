//import { } from '../libs/jquery-3.4.1/jquery-3.4.1.min.js';
//import { mat4 } from '../libs/gl-matrix/src/index.js';

let mat4 = glMatrix.mat4;
let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 5000; //ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =
    "attribute vec3 vertexPos;\n" +
    "attribute vec4 vertexColor;\n" +
    "uniform mat4 modelViewMatrix;\n" +
    "uniform mat4 projectionMatrix;\n" +
    "varying vec4 vColor;\n" +
    "void main(void){\n" +
    "   // Return the transformed and projected vertex value\n" +
    "   gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);\n" +
    "   //Output the vertexColor into vColor\n" +
    "   vColor = vertexColor;\n" +
    "}\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
let fragmentShaderSource =
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

//Initialize WebGL
//Step 2 -> Obtain context
function initWebGL(canvas) {
    let gl = null;
    let msg = "Your browser does not support WebGL or it is not enabled by default";

    try {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (error) {
        msg = "Error creating WebGL context: " + error.toString();
    }

    if (!gl) {
        alert(msg);
        throw new Error(msg);
    }

    return gl;
}

//Step 3 -> Initialize viewport
/**
 * 
 * @param {WebGLRenderingContext} gl
 * @param {HTMLCanvasElement} canvas
 */
function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
}

//Step 4 -> Create buffers
/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
function initGL(canvas) {
    //Projection matrix with a 45 degree field of view
    //This is the camera
    projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

//Step 5 -> Create transformation matrix
/**
 * 
 * @param {WebGLRenderingContext} gl
 * @param {number} translation
 * @param {number} rotationAxis
 */
function createPyramid(gl, translation, rotationAxis) {
    //Vertex data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //Pentagonal pyramid
    let vertices = [
        //Bottom face -> pentagon
        +0.0, -0.5, -0.5,   //0 -> Far point
        -0.7, -0.5, +0.0,   //1 -> Left mid
        -0.5, -0.5, +0.5,   //2 -> Bottom left
        +0.5, -0.5, +0.5,   //3 -> Bottom right
        +0.7, -0.5, +0.0,   //4 -> Right mid

        //Front face
        -0.5, -0.5, +0.5,   //5 (2) -> Bottom left
        +0.5, -0.5, +0.5,   //6 (3) -> Bottom right
        +0.0, +0.5, +0.0,   //7 -> Top

        //Right front face
        -0.5, -0.5, +0.5,   //8 (2) -> Bottom left
        +0.5, -0.5, +0.5,   //9 (3) -> Bottom right
        +0.0, +0.5, +0.0,   //10 (7) -> Top

        //Right back face
        +0.7, -0.5, +0.0,   //11 (4) -> Right mid
        +0.0, -0.5, -0.5,   //12 (0) -> Far point
        +0.0, +0.5, +0.0,   //13 (7) -> Top

        //Left back face
        +0.0, -0.5, -0.5,   //14 (0) -> Far point
        -0.7, -0.5, +0.0,   //15 (1) -> Left mid
        +0.0, +0.5, +0.0,   //16 (7) -> Top

        //Left front face
        -0.7, -0.5, +0.0,   //17 (1) -> Left mid
        -0.5, -0.5, +0.5,   //18 (2) -> Bottom left
        +0.0, +0.5, +0.0,   //19 (7) -> Top
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], //Base color
        [0.0, 1.0, 0.0, 1.0], //Front face
        [0.0, 0.0, 1.0, 1.0], //Right front face
        [1.0, 1.0, 0.0, 1.0], //Right back face
        [1.0, 0.0, 1.0, 1.0], //Left front face
        [0.0, 1.0, 1.0, 1.0]  //Left back face  
    ];

    //Assign a color to each vertex
    let vertexColors = [];
    faceColors.forEach(color => {
        for (let i = 0; i < 3; i++) {
            vertexColors.push(...color);
        }
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    let pyramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);

    //Index data -> defines which vertices form each triangle face
    let pyramidIndices = [
        0, 1, 2,    //Base
        2, 0, 3,    //Base
        3, 4, 0,    //Base
        /////////////////////////
        5, 6, 7,    //Front face
        8, 9, 10,   //Right front face
        11, 12, 13, //Right back face
        14, 15, 16, //Left back face
        17, 18, 19  //Left front face
    ];
    console.log(vertices.length);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);

    let pyramid = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: pyramidIndexBuffer,
        vertSize: 3, nVerts: vertices.length, colorSize: 3, nColors: vertexColors.length, nInices: pyramidIndices.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function () {
        let now = Date.now();
        let deltaT = now - this.currentTime;
        this.currentTime = now;
        let fract = deltaT / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };

    return pyramid;
}

function createShader(gl, str, type) {
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl) {
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs) {
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for (i = 0; i < objs.length; i++) {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) {
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function () { run(gl, objs); });

    draw(gl, objs);

    for (i = 0; i < objs.length; i++)
        objs[i].update();
}

//Main function
$(document).ready(function () {
    //Step 1 -> Create canvas
    /** @type {HTMLCanvasElement} */
    //Defines canvas as a canvas HTML5 element
    let canvas = document.getElementById('WebGLCanvas');
    canvas.style.width = "100%";
    canvas.style.height = "50%";
    canvas.style.border = "1px solid black";

    //Step 2 -> Get context
    //Enables code completion for WebGL in a local context
    /** @type {WebGLRenderingContext} */
    let gl = initWebGL(canvas);

    //Step 3 -> Initialize viewport
    initViewport(gl, canvas);

    //Step 4 -> Create buffers
    initGL(canvas);

    //Step 5 -> Create transformation matrixes
    let pyramid = createPyramid(gl, [0, 0, -10], [0, 0, 0]);

    initShader(gl);
    run(gl, pyramid)
})