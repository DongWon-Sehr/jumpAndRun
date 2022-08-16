const scorePanel = document.body.querySelector('#score');
const replay = document.body.querySelector('#replay');
const canvas = document.body.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 300;
canvas.style.border = "1px solid blue";

const groundPosition = canvas.height - 50;
var dino = {
    width: 50,
    height: 50,
    x: 10,
    y: groundPosition,
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var logos = [
    [
        "img/logo_amagi.png",
        "img/logo_wurl.png",
        "img/logo_lg_channels.png",
        "img/logo_samsung_tvplus.png",
    ],
    [
        "img/logo_ena.png",
        "img/logo_mbcplus.png",
        "img/logo_iristv.png",
        "img/logo_skb_playz.png",
        "img/logo_slingtv.png",
        "img/logo_plutotv.png",
        "img/logo_rakuten.png",
        "img/logo_plex.png",
        "img/logo_vizio.png",
    ],
    [
        "img/logo_roku.png",
        "img/logo_xumo.png",

    ],
];

function getRandomLogoUrl() {
    var rate = Math.floor(Math.random() * 10);
    if (rate < 5) {
        firstIndex = 0;
    } else if (rate >= 5 && rate < 10) {
        firstIndex = 1;
    } else if (rate >= 10 && rate < 11) {
        firstIndex = 2;
    } else {
        firstIndex = 0;
    }

    targetLength = logos[firstIndex].length;
    var secondIndex = Math.floor(Math.random() * (targetLength - 1));

    console.log(logos[firstIndex][secondIndex]);
    return logos[firstIndex][secondIndex] ?? logos[0][2];
}

class Obstacle {
    constructor(imgSrc = "") {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width - 10;
        this.y = groundPosition + (dino.height - this.height);
        this.imgSrc = imgSrc;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.imgSrc.length > 0) {
            var imgObstacle = new Image();
            imgObstacle.src = this.imgSrc;
            ctx.drawImage(imgObstacle, this.x - (100 - this.width), this.y - (100 - this.height), 100, 100);
        }
    }
}

var timer = 0;
var score = 0;
var obstacles = [];
const ceilingPosition = groundPosition - dino.height * 3;
var jumpTimer = 0;
var animation;
var obstacleSpeed = 3;
var level = 0;

function executeByFrame() {
    animation = requestAnimationFrame(executeByFrame);
    obstacleSpeed = 3 + score / 1000;
    level = Math.floor(obstacleSpeed) - 2;

    scorePanel.innerHTML = `Score: ${score} / Speed: ${(obstacleSpeed).toFixed(2)} / Level: ${level}`;

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var seed = Math.floor(Math.random() * 4);
    if (timer % (110 - ((level - 1) * 10) + (seed * 5)) === 0) {
        var obstacle = new Obstacle(getRandomLogoUrl());
        obstacles.push(obstacle);
        timer = 0;
    }


    obstacles.forEach((target, index, array) => {

        if (target.x < -Math.abs(target.width)) {
            array.splice(index, 1);
        }

        target.x -= obstacleSpeed;

        checkCollision(dino, target);

        target.draw();
    });

    if (isJumping === true && isLanding === false) {
        if (dino.y >= ceilingPosition) {
            jumpTimer++;
            dino.y -= 3;
            // dino.y -= (3 - jumpTimer/10) ;
        } else {
            isJumping = false;
            isLanding = true;
        }
    }

    if (isJumping === false && isLanding === true) {
        if (dino.y <= groundPosition) {
            jumpTimer = 0;
            dino.y += 3;
        } else {
            dino.y = groundPosition;
            isLanding = false;
        }
    }
    dino.draw();

    timer++;
    score++;
}
executeByFrame();

function checkCollision(dinoCurrent, obstacleCurrent) {
    const dinoTop = dinoCurrent.y;
    const dinoBottom = dinoCurrent.y + dinoCurrent.height;
    const dinoLeft = dinoCurrent.x;
    const dinoRight = dinoCurrent.x + dinoCurrent.width;
    const obstacleTop = obstacleCurrent.y;
    const obstacleBottom = obstacleCurrent.y + obstacleCurrent.height;
    const obstacleLeft = obstacleCurrent.x;
    const obstacleRight = obstacleCurrent.x + obstacleCurrent.width;

    if (dinoRight >= obstacleLeft && dinoLeft <= obstacleRight
        && dinoBottom >= obstacleTop && dinoTop <= obstacleBottom) {
        cancelAnimationFrame(animation);
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

var isJumping = false;
var isLanding = false;

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && isLanding === false) {
        isJumping = true;
        console.log("Jump!");
    }
});

replay.addEventListener('click', function (e) {
    window.location.reload();
});