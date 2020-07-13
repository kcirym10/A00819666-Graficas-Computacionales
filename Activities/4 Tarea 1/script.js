///<reference path="../libs/gl-matrix/src/mat4.js"/>

let mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 5000; // ms

/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
function initWebGL(canvas) {
    let ctx = null;
    let msg = 'Error initializing context';
    //First check try the context
    try {
        ctx = canvas.getContext('experimental-webgl');
    } catch (e) {
        alert(msg);
        throw new Error(msg + e.toString());
    }

    if (!ctx)
        console.log(msg);

    return ctx;
}

/**
 * 
 * @param {WebGLRenderingContext} gl
 */
function clearCanvas(gl) {
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //alert(gl.getParameter(gl.COLOR_CLEAR_VALUE));
}

/**
 * 
 * @param {WebGLRenderingContext} gl
 * @param {HTMLCanvasElement} canvas
 */
function initViewport(gl, canvas) {
    clearCanvas(gl);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
function initGL(canvas) {
    projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

/**
 * 
 * @param {WebGLRenderingContext} gl
 * @param {vec3} transformation
 * @param {vec3} rotation
 */
function createPyramid(gl, translation, rotation) {
    //Step 1 -> Create the geometry and define indices
    //Define pyramid geometry
    let vertices = [
        //Base -> [0, 1, 2] -> [2, 3, 0] -> [3, 4, 0]
        +0.0, -1.0, -1.0, //0 - Far point
        -1.0, -1.0, +0.0, //1 - Far right
        -0.5, -1.0, +1.0, //2 - Near right
        +0.5, -1.0, +1.0, //3 - Near left
        +1.0, -1.0, +0.0, //4 - Far left

        //Front face
        -0.5, -1.0, +1.0, //5 - Near right
        +0.5, -1.0, +1.0, //6 - Near left
        +0.0, +1.0, +0.0, //7 - Tip Top

        //Right front face
        -1.0, -1.0, +0.0, //8 - Far right
        -0.5, -1.0, +1.0, //9 - Near right
        +0.0, +1.0, +0.0, //10 - Tip Top

        //Right back face
        +0.0, -1.0, -1.0, //11 - Far point
        -1.0, -1.0, +0.0, //12 - Far right
        +0.0, +1.0, +0.0, //13 - Tip Top

        //Left back face
        +0.0, -1.0, -1.0, //14 - Far point
        +1.0, -1.0, +0.0, //15 - Far left
        +0.0, +1.0, +0.0, //16 - Tip Top

        //Left front face
        +0.5, -1.0, +1.0, //17 - Near left
        +1.0, -1.0, +0.0, //18 - Far left
        +0.0, +1.0, +0.0, //19 - Tip Top
    ];
    console.log(vertices);

    //Define vertex colors
    let colors = [
        [1.0, 0.0, 0.0, 1.0], //Base
        [0.0, 1.0, 0.0, 1.0], //Front face
        [0.0, 0.0, 1.0, 1.0], //Front right face
        [1.0, 1.0, 0.0, 1.0], //Back right face
        [1.0, 0.0, 1.0, 1.0], //Back left face
        [0.0, 1.0, 1.0, 1.0]  //Front left face
    ];
    let vertexColors = [];
    //Assign a color to each vertex of the shape, in this case 5 vertices for the base and 3 for each triangle
    let isBase = true;
    colors.forEach(color => {
        if (!isBase) {
            for (let i = 0; i < 3; i++)
                vertexColors.push(...color);
        }
        else {
            isBase = false;
            for (let i = 0; i < 5; i++)
                vertexColors.push(...color);
        }

    });
    console.log(vertexColors);

    //Define indices
    let indices = [
        0, 1, 2,        //Base
        2, 3, 0,        //Base
        3, 4, 0,        //Base
        ////////////
        5, 6, 7,        //Front face
        8, 9, 10,       //Right near
        11, 12, 13,     //Right far
        14, 15, 16,     //Left far
        17, 18, 19      //Left near
    ];
    console.log(indices);

    //Create, bind, pass data, unbind buffers
    //Vertex buffer
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //Color buffer
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    //Index buffer
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    let pyramid = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: indexBuffer,
        vertSize: 3, nVerts: vertices.length / 3, colorSize: 4, nColors: 12, nIndices: indices.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function () {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotation);
    };

    return pyramid;
}

/**
 * 
 * @param {WebGLRenderingContext} gl
 * @param {vec3} translation
 * @param {vec3} rotation
 */
function createDodecahedron(gl, translation, rotation) {
    //Step 1 -> Define geometry
    let vertices = [
        //Front face
        +0.00, +0.75, +1.00,    //0 -> Top front
        -0.75, +0.00, +1.00,    //1 -> Top front left
        -0.50, -0.75, +1.00,    //2 -> Bottom front left
        +0.50, -0.75, +1.00,    //3 -> Bottom front right
        +0.75, +0.00, +1.00,    //4 -> Top front left

        //Bottom front face
        -0.50, -0.75, +1.00,    //5 -> Bottom front left
        +0.50, -0.75, +1.00,    //6 -> Bottom front right
        +0.00, -1.00, +0.00,    //7 -> Lowest point
        -0.75, -0.90, +0.50,    //8 -> Bottom front left
        +0.75, -0.90, +0.50,    //9 -> Bottom front right

        //Bottom back face
        -0.50, -0.75, -1.00,    //10 -> Bottom back left
        +0.50, -0.75, -1.00,    //11 -> Bottom back right
        +0.00, -1.00, +0.00,    //12 -> Lowest point
        -0.75, -0.90, -0.50,    //13 -> Bottom back left
        +0.75, -0.90, -0.50,    //14 -> Bottom back right

        //Back face
        +0.00, +0.75, +1.00,    //0 -> Top back
        -0.75, +0.00, +1.00,    //1 -> Top back left
        -0.50, -0.75, +1.00,    //2 -> Bottom back left
        +0.50, -0.75, +1.00,    //3 -> Bottom back right
        +0.75, +0.00, +1.00,    //4 -> Top back left
    ];

    let faceColors = [
        [0.5, 0.0, 0.0, 1.0],
        [0.0, 0.5, 0.0, 1.0],
        [0.0, 0.0, 0.5, 1.0],
        [0.5, 0.5, 0.0, 1.0],
        [0.5, 0.0, 0.5, 1.0],
        [0.0, 0.5, 0.5, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0]
    ];

    let colors = [];
    faceColors.forEach(color => {
        for (let i = 0; i < 5; i++)
            colors.push(...color);
    });

    let indices = [
        0, 1, 2,
        2, 3, 0,
        0, 3, 4,

        5, 6, 7,
        5, 7, 8,
        6, 7, 9,

        10, 11, 12,
        10, 12, 13,
        11, 12, 14,


    ];

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    let dode = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: indexBuffer,
        vertSize: 3, nVerts: vertices.length / 3, colorSize: 4, nColors: 1, nIndices: indices.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(dode.modelViewMatrix, dode.modelViewMatrix, translation);

    dode.update = function () {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotation);
    };

    return dode;
}

//Main function
//JQuery used to ensure proper processing once page has loaded
$(document).ready(
    function () {
        let canvas = document.getElementById('myCanvas');
        let gl = null;
        //Step 1 -> Initialize a WebGL context
        gl = initWebGL(canvas);

        //Step 2 -> Clear the canvas background and initialize the viewport
        initViewport(gl, canvas);
        initGL(canvas);

        //Step 3 -> Create geometries and buffers
        let pyramid = createPyramid(gl, [-3, 0, -4], [0.1, 1.0, 0.2]);
        let dode = createDodecahedron(gl, [0, 0, -4], [0.0, 0.1, 0.0]);

        //Initialize shader
        initShader(gl);
        run(gl, [dode]);
    }
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

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