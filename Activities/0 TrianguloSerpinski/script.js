function drawTriangle(xpi, ypi, width, height, context) {
    context.beginPath();
    context.fillStyle = "#1A535C";
    context.moveTo(xpi + width / 2, ypi);
    context.lineTo(xpi, ypi + height);
    context.lineTo(xpi + width, ypi + height);
    context.lineTo(xpi + width / 2, ypi);    
    context.closePath();
    context.fill();
    context.stroke();
}

drawRecursive(numTriangles){
    if (numTriangles === 0)
        drawTriangle(0, 0, width, height, context);
}
//Called from onLoad() event
function main() {
    //Draw a triangle with no subdivisions
    let width = window.innerWidth / 2;
    let height = width;

    var myCanvas = document.getElementById("myCanvas");
    var context = myCanvas.getContext("2d");

    myCanvas.width = width;
    myCanvas.height = height;

    drawTriangle(0, 0, width, height, context);
}