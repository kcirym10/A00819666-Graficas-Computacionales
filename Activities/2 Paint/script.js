// JavaScript source code
let canvas;
let ctx;

const elements = ['myRange', 'clearBtn', 'color1', 'color2', 'color3', 'color4', 'color5', 'color6'];

class Canvas {
    constructor() {
        //Const Canvas Position
        this.canvasPos = canvas.getBoundingClientRect();
        this.canDraw = false;
        //Create border edge
        this.clear();
        //Enable drawing
        canvas.addEventListener('mouseenter', (event) => {
            this.canDraw = true;
            console.log('Enter');
        });
        //Disable drawing
        canvas.addEventListener('mouseleave', (event) => {
            this.canDraw = false;
            console.log('Exit');
        })
    }
    clear() {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
        ctx.closePath();
    }
}

class Brush extends Canvas{
    constructor(size, lineColor) {
        super();
        this.size = size;
        this.lineColor = lineColor;
        this.drawing = false;

        //MouseDown Event
        canvas.addEventListener('mousedown', (event) => {
            if (!this.canDraw) {
                console.log('Drawing not allowed');
                this.drawing = false;
                ctx.closePath();
                return;
            }

            if (this.canDraw && event.button === 0) {
                console.log('Started Drawing');
                this.drawing = true;
                ctx.beginPath();
                ctx.moveTo(event.clientX - this.canvasPos.left, event.clientY - this.canvasPos.top);
                this.draw(event.clientX - this.canvasPos.left, event.clientY - this.canvasPos.top);
            }
        });
        //MouseUp Event
        canvas.addEventListener('mouseup', (event) => {
            console.log('Finished Drawing');
            this.drawing = false;
            ctx.closePath();
        });
        //My update function
        canvas.addEventListener('mousemove', (event) => {
            console.log(`Screen Coords (${this.canvasPos.left}, ${this.canvasPos.top}`);
            this.draw(event.clientX - this.canvasPos.left, event.clientY - this.canvasPos.top);
        });
    }
    draw(xPos, yPos) {
        if (this.canDraw && this.drawing) {
            ctx.lineTo(xPos, yPos);
            ctx.stroke();
            console.log(`Coords (${xPos}, ${yPos})`);
        }
    }
}

function main() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    let brush = new Brush(1, 'black');

    attachEvents();
}

function attachEvents() {
    elements.forEach((element) => {
        console.log(element);
        
    });
    //Same
    /*for (element of elements) {
        console.log(element);
    }*/
}