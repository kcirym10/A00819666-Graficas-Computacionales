let mat4 = import glMatrix from '../libs/gl-matrix/gl-matrix.js';
mat4 = mat4.mat4

function getRad(theta) {
    console.log(theta * Math.PI / 180);
    return theta * Math.PI / 180;
}

function initCanvas(canvas) {
    let gl = null;
    let msg = "Your browser does not support WebGL";

    try {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (e) {
        msg = "Error creating WebGL context: " + e.toString();
    }

    if (!gl) {
        alert(msg);
        throw new Error(msg);
    }

    return gl;
}

function redraw(gl) {
    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //// Clears the color buffer; the area in GPU memory used to render the bits on screen.
    //// There are several buffers, including the color, and depth buffers.
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    redraw(gl);
}

//Matrixes
let projectionMatrix;

function initMatrixes(canvas) {
    //Camera
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10);
}

function createSquare(gl) {
    //Allows for the trasformation of the object in space
    let modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-1.25, 0.75, -3.5]);

    //Initialize buffer and set the information
    let vertexBuffer;

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        0.5, 0.5, 0,
        -0.5, -0.5, 0,
        -0.5, 0.5, 0,

        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        0.5, 0.5, 0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let square = { buffer: vertexBuffer, vertSize: 3, nVerts: verts.length / 3, primtype: gl.TRIANGLES, modelView: modelViewMatrix };
    return square;
}

function createTriangle(gl) {

    let modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [1.25, 0.75, -3.5]);

    let vertexBuffer;

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        0, 0.5, 0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let triangle = { buffer: vertexBuffer, vertSize: 3, nVerts: 3, primtype: gl.TRIANGLES, modelView: modelViewMatrix };
    return triangle;
}

function createDiamond(gl) {

    let modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-1.25, -0.75, -3.5])

    let vertexBuffer;

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        0, 0.5, 0,
        -0.5, 0, 0,
        0, -0.5, 0,

        0, -0.5, 0,
        0.5, 0, 0,
        0, 0.5, 0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let diamond = { buffer: vertexBuffer, vertSize: 3, nVerts: verts.length / 3, primtype: gl.TRIANGLES, modelView: modelViewMatrix };
    return diamond;
}

function createPacman(gl, startAngle) {
    let modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [1.25, -0.75, -3.5]);

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [0, 0, 0];
    let rad = 0.5;
    let fan = false;

    let end = 2 * Math.PI - getRad(startAngle);
    console.log(end);
    for (start = getRad(startAngle); start <= end; start += 0.01) {
        //console.log(`x: ${rad * Math.cos(start)}, y: ${rad * Math.sin(start)}`);
        
        verts.push(rad * Math.cos(start));
        verts.push(rad * Math.sin(start));
        verts.push(0);
    }
    if (!fan) {
        verts.push(0);
        verts.push(0);
        verts.push(0);
        verts.push(rad * Math.cos(start));
        verts.push(rad * Math.sin(start));
        verts.push(0);
    }
    else {
        verts.push(0);
        verts.push(0);
        verts.push(0);
    }


    //for (i = 0; i < verts.length; i++) {
    //    console.log(verts[i]);
    //}

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let pacman;
    if (!fan)
        pacman = { buffer: vertexBuffer, vertSize: 3, nVerts: verts.length / 2, primtype: gl.LINES, modelView: modelViewMatrix }
    else
        pacman = { buffer: vertexBuffer, vertSize: 3, nVerts: verts.length / 3, primtype: gl.TRIANGLE_FAN, modelView: modelViewMatrix }
    return pacman;
}

let startAngle = 30;

function update(gl, startAngle, closing) {
    if ((!closing && startAngle === 30) || (closing && startAngle === 0))
        closing = !closing;
    if (closing)
        requestAnimationFrame(() => update(gl, startAngle - 1, closing));
    else
        requestAnimationFrame(() => update(gl, startAngle + 1, closing));

    console.log()

    redraw(gl);

    let square = createSquare(gl);
    draw(gl, square);

    let triangle = createTriangle(gl);
    draw(gl, triangle);

    let diamond = createDiamond(gl);
    draw(gl, diamond);

    let pacman = createPacman(gl, startAngle);
    draw(gl, pacman);
}
/* Already provided shader */

// Helper function that uses WebGL methods to compile the vertex and fragments shaders from a source.
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

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These are constant during a rendering cycle, such as lights position.
// Varyings: Used for passing data from the vertex shader to the fragment shader.
let vertexShaderSource =

    "    attribute vec3 vertexPos;\n" +         //Vertice que viene del buffer
    "    uniform mat4 modelViewMatrix;\n" +     //Objeto
    "    uniform mat4 projectionMatrix;\n" +    //Camara
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "    }\n";

let fragmentShaderSource =
    "    void main(void) {\n" +
    "    // Return the pixel color: always output white\n" +
    "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n" +
    "}\n";

let shaderProgram, shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

function initShader(gl) {
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Obtain handles to each of the variables defined in the GLSL shader code so that they can be initialized
    // gl.getAttribLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the attribute variable whose location to get
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    // gl.getUniformLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the uniform variable whose location to get
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, obj) {
    // set the shader to use
    gl.useProgram(shaderProgram);

    // connect up the shader parameters: vertex position and projection/model matrices
    // set the vertex buffer to be drawn
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

    // Specifies the memory layout of the vertex buffer object. It must be called once for each vertex attribute.
    // gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    // index: A GLuint specifying the index of the vertex attribute that is to be modified.
    // size: A GLint specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.
    // type: A GLenum specifying the data type of each component in the array.
    // normalized: A GLboolean specifying whether integer data values should be normalized into a certain range when being casted to a float.
    // stride: A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes.
    // offset: A GLintptr specifying an offset in bytes of the first component in the vertex attribute array
    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

    // WebGLRenderingContext.uniformMatrix4fv(location, transpose, value); 
    // location: A WebGLUniformLocation object containing the location of the uniform attribute to modify. The location is obtained using getAttribLocation().
    // transpose: A GLboolean specifying whether to transpose the matrix.
    // value: A Float32Array or sequence of GLfloat values.
    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelView);

    // draw the object
    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}