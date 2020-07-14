class Triangle {
    /**
     * 
     * Vertices
     * @param {vec2} v0 //Top
     * @param {vec2} v1 //Left
     * @param {vec2} v2 //Right
     */
    constructor(v0, v1, v2) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2
    }
}

function clear(context, color, width, height) {
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
}
/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {any} color
 * @param {Triangle} t
 */
function drawTriangle(context, color, t) {
    context.beginPath();
    context.fillStyle = color;
    context.moveTo(t.v0[0], t.v0[1]);
    context.lineTo(t.v1[0], t.v1[1]);
    context.lineTo(t.v2[0], t.v2[1]);
    context.lineTo(t.v0[0], t.v0[1]);
    context.fill();
    context.closePath();
}

function sierpinski(context, parentT, subDivision) {
    console.log(subDivision);
    console.log(parentT);
    if (subDivision == 0)
        drawTriangle(context, "#023E8A", parentT);
    else {
        //Top triangle
        let child = new Triangle(
            parentT.v0,
            [(parentT.v0[0] + parentT.v1[0]) / 2, (parentT.v0[1] + parentT.v1[1]) / 2],
            [(parentT.v0[0] + parentT.v2[0]) / 2, (parentT.v0[1] + parentT.v2[1]) / 2]
        );
        sierpinski(context, child, subDivision - 1);

        //Left triangle
        child = new Triangle(
            [(parentT.v0[0] + parentT.v1[0]) / 2, (parentT.v0[1] + parentT.v1[1]) / 2],
            parentT.v1,
            [(parentT.v1[0] + parentT.v2[0]) / 2, (parentT.v1[1] + parentT.v2[1]) / 2]
        );
        sierpinski(context, child, subDivision - 1);

        //Right triangle
        child = new Triangle(
            [(parentT.v0[0] + parentT.v2[0]) / 2, (parentT.v0[1] + parentT.v2[1]) / 2],
            [(parentT.v1[0] + parentT.v2[0]) / 2, (parentT.v1[1] + parentT.v2[1]) / 2],
            parentT.v2
        );
        sierpinski(context, child, subDivision - 1);
    }
}

//Called from onLoad() event
function main() {
    let width = window.innerWidth / 2;
    //Set correct height. If width is larger than window height then set to 80% window height
    let height = (width <= window.innerHeight ? width : 0.85 * window.innerHeight);

    //Get Canvas element and set appriopritate context
    let myCanvas = document.getElementById("myCanvas");
    let context = myCanvas.getContext("2d");
    let triangle = new Triangle([width / 2,0], [0, height], [width, height]);

    //Set canvas size
    myCanvas.width = width;
    myCanvas.height = height;

    //Draw undivided triangle
    sierpinski(context, triangle, 0);
    sliderChange(context, myCanvas, triangle);
}

function sliderChange(context, canvas, baseTriangle) {
    document.getElementById("myRange").oninput = (event) => {
        let rangeValue = event.target.value;

        console.log(baseTriangle);
        document.getElementById('rangeValue').innerHTML = ` ${rangeValue}`
        clear(context, '#FFFF', canvas.width, canvas.height);
        sierpinski(context, baseTriangle, rangeValue);
    }
}