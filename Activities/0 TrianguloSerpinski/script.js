class Triangle {
    constructor(width, height, xStart, yStart) {
        this.width = width;
        this.height = height;
        this.center = [width / 2, height / 2];
        this.xStart = xStart;
        this.yStart = yStart;
    }
}

function clear(context, color, width, height) {
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
}

function drawTriangle(context, color, t) {
    context.beginPath();
    context.fillStyle = color;
    context.moveTo(t.xStart + t.center[0], t.yStart);
    context.lineTo(t.xStart, t.yStart + t.height);
    context.lineTo(t.xStart + t.width, t.yStart + t.height);
    context.lineTo(t.xStart + t.center[0], t.yStart);
    //context.fill();
    context.stroke();
    context.closePath();
}

function drawFractal(context, parentT, childT, subDivision) {
    if (subDivision == 0)
        return drawTriangle(context, "#023E8A", childT);

    //Top triangle                                                                V <----parentT.center[0] ERROR
    drawFractal(context, childT, new Triangle(childT.center[0], childT.center[1],  childT.topX(), childT.topY()), subDivision - 1);
    //Left triangle
    drawFractal(context, childT, new Triangle(childT.center[0], childT.center[1], childT.leftX(), childT.leftY()), subDivision - 1);
    //Right triangle
    drawFractal(context, childT, new Triangle(childT.center[0], childT.center[1], childT.rightX(), childT.rightY()), subDivision - 1);
}

//Called from onLoad() event
function main() {
    let width = window.innerWidth / 2;
    //Set correct height. If width is larger than window height then set to 80% window height
    let height = (width <= window.innerHeight ? width : 0.85 * window.innerHeight);
    console.log(height);
    //Get Canvas element and set appriopritate context
    let myCanvas = document.getElementById("myCanvas");
    let context = myCanvas.getContext("2d");
    let triangle = new Triangle(width, height, 0, 0);

    //Set canvas size
    myCanvas.width = width;
    myCanvas.height = height;

    //Draw undivided triangle
    drawFractal(context, null, triangle, 0);
    sliderChange(context, myCanvas, triangle);
}

function sliderChange(context, canvas, baseTriangle) {
    document.getElementById("myRange").oninput = (event) => {
        let rangeValue = event.target.value;
        console.log(rangeValue);
        document.getElementById('rangeValue').innerHTML = ` ${rangeValue}`
        clear(context, '#FFFF', canvas.width, canvas.height);
        drawFractal(context, null, baseTriangle, rangeValue);
    }
}