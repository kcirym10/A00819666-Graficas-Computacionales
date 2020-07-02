// JavaScript source code
let canvas
let ctx = null;

function playerBallCollition(player, ball) {
    if (ball.right) {
        if (player.x <= ball.x + ball.radius && ball.y >= player.y && ball.y <= player.y + player.height)
            ball.right = false;
    }
    else {
        if (player.x + player.width >= ball.x - ball.radius && ball.y >= player.y && ball.y <= player.y + player.height)
            ball.right = true;
    }
}

class bar {
    constructor(color, x, y, width, height, isAI, upKey, downKey) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isAI = isAI;
        this.upKey = upKey;
        this.downkey = downKey;
        this.AISpeed = 1;
        document.addEventListener('keypress', (key) => {
            if (key.key === this.upKey)
                this.y -= 4;
            if (key.key === this.downkey)
                this.y += 4;
        })
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    }
    moveAI(ball) {
        if (ball.y > this.y)
            this.y += this.AISpeed;
        if (ball.y < this.y)
            this.y -= this.AISpeed;
    }
}

class sphere{
    constructor(color, x, y, radius) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 3;
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
        ctx.closePath();
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

//Fix update function
function update(Objects) {
    requestAnimationFrame(() => update(Objects));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Objects.forEach(Objects => {
        if (Objects['draw'])
            Objects.draw();
        if (Objects['update'])
            Objects.update(canvas.width, canvas.height);
    });
    
    Objects[0].moveAI(Objects[1]);

    if (Objects[1].right === true)
        playerBallCollition(Objects[2], Objects[1]);
    else
        playerBallCollition(Objects[0], Objects[1]);
    ////////////////////////////
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.closePath();
}

/*function update(objects){  requestAnimationFrame(() => update(objects));  ctx.clearRect(0,0, canvas.width, canvas.height);  objects.forEach(object => {    if(object['draw'])      object.draw();    if(object['update'])      object.update(canvas.width, canvas.height);  });}
*/

function main() {
    canvas = document.getElementById("ballCanvas");
    ctx = canvas.getContext("2d");

    let ball = new sphere('white', canvas.width / 2, canvas.height / 2, 20);
    let player = new bar('white', 20, canvas.height / 2 - canvas.height / 10, 20, canvas.height / 5, true, 'w', 's');
    let player1 = new bar('white', canvas.width - 40, canvas.height / 2 - canvas.height / 8, 20, canvas.height / 4, false, 'o', 'l');

    update([player, ball, player1]);
}