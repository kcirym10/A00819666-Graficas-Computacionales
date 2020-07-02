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
    constructor(color, x, y, width, height, isAI, upKey, downKey, playerSpeed) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isAI = isAI;
        this.upKey = upKey;
        this.downkey = downKey;
        this.playerSpeed = playerSpeed;
        document.addEventListener('keypress', (key) => {
            if (key.key === this.upKey) {
                if (this.checkLimits(0))
                    this.y = 0;
                else
                    this.y -= this.playerSpeed;
            }
            if (key.key === this.downkey) {
                if (this.checkLimits(canvas.height))
                    this.y = canvas.height - this.height;
                else
                    this.y += this.playerSpeed;
            }
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
        console.log('a');
        if (ball.up) {
            if (this.checkLimits(0))
                this.y = canvas.height - this.height;
            else
                this.y -= this.playerSpeed;
        }
        else {
            if (this.checkLimits(canvas.height))
                this.y = 0;
            else
                this.y += this.playerSpeed;
        }
    }
    checkLimits(yLimit) {
            
        if (yLimit === 0) {
            if (this.y - this.playerSpeed <= 0)
                return true;
        }
        else {
            if (this.y + this.height + this.playerSpeed > yLimit)
                return true;
        }
        return false;
    }
}

class sphere{
    constructor(color, x, y, radius, speed) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
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
            this.x += this.speed;
        else
            this.x -= this.speed;

        if (this.up)
            this.y -= this.speed;
        else
            this.y += this.speed;
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

/*function update(objects)
{
  requestAnimationFrame(() => update(objects));

  ctx.clearRect(0,0, canvas.width, canvas.height);

  objects.forEach(object => {
    if(object['draw'])
      object.draw();
    if(object['update'])
      object.update(canvas.width, canvas.height);
  });
}
*/

function main() {
    canvas = document.getElementById("ballCanvas");
    ctx = canvas.getContext("2d");

    let ball = new sphere('white', canvas.width / 2, canvas.height / 2, 20, 3);
    let player = new bar('white', 20, canvas.height / 2 - canvas.height / 10, 20, canvas.height / 5, true, 'w', 's', 2);
    let player1 = new bar('white', canvas.width - 40, canvas.height / 2 - canvas.height / 8, 20, canvas.height / 4, false, 'o', 'l', 4);

    update([player, ball, player1]);
}