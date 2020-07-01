// JavaScript source code
let canvas
let ctx = null;

class sphere{
    constructor(color, x, y, radius) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius;
        //La logica de las animaciones se maneja
        //como maquinas de estado simples
        this.right = true;
        this.up = true;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    update(xLimit, yLimit) {
        if (this.x + this.radius >= xLimit)
            this.right = false;
        if (this.x <= this.radius)
            this.right = true;

        if (this.y + this.radius >= yLimit) //Coordenada positiva hacia abajo
            this.up = true;
        if (this.y <= this.radius)
            this.up = false;

        if (this.right)
            this.x += 2;
        else
            this.x -= 2;

        if (this.up)
            this.y -= 2;
        else
            this.y += 2;
    }
}

function update(ball) {
    requestAnimationFrame(() => update(ball));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.draw();
    ball.update(canvas.width, canvas.height);
}

function main() {
    canvas = document.getElementById("ballCanvas");
    ctx = canvas.getContext("2d");

    let ball = new sphere('white', canvas.width / 2, canvas.height / 2, 20);

    update(ball);
}