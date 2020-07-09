import { } from '../libs/jquery-3.4.1/jquery-3.4.1.min.js';
import { mat4 } from '../libs/gl-matrix/src/index.js';


let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, ShaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 5000; //ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShader =
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
 * @param {any} translation
 * @param {any} rotationAxis
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
        for (let i = 0; i < 3; i++)
            vertexColors.push(...color);
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

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);

    let pyramid = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: pyramidIndexBuffer,
        vertSize: 3, nVerts: vertices.length / 3, colorSize: 3, nInices: pyramidIndices.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
    }

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

    //initShader(gl);
    //run(gl, [pyramid])
})