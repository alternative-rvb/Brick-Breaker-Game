"use strict";

/*jshint esversion: 6 */
console.log("Script begin ...");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); // Config

var vitesse = 15; //vitesse ms

var cheat = 0; // 0 ... 5 max

var vies = 3; // Balle

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10; // Raquette

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false; // Briques

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 40;
var brickOffsetLeft = 30;
var score = 0; // Tableau des briques

var bricks = [];

for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];

  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
} // Affichage de la balle


var drawBall = function drawBall() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "red";
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}; // Affichage de la raquette


var drawPaddle = function drawPaddle() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : " green";
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}; // Affichage des briques


var drawBricks = function drawBricks() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#0095DD";

  for (var _c = 0; _c < brickColumnCount; _c++) {
    for (var _r = 0; _r < brickRowCount; _r++) {
      if (bricks[_c][_r].status == 1) {
        var brickX = _c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = _r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[_c][_r].x = brickX;
        bricks[_c][_r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}; // Affichage du score


var drawScore = function drawScore() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "green";
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = color;
  ctx.fillText("Score: " + score, 30, 30);
}; // Affichage du nombre de vies


var drawLives = function drawLives() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "green";
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = color;
  ctx.fillText("Vies: " + vies, canvas.width - 90, 30);
}; // Détection des colisions de la balle avec les briques


var collisionDetection = function collisionDetection() {
  for (var _c2 = 0; _c2 < brickColumnCount; _c2++) {
    for (var _r2 = 0; _r2 < brickRowCount; _r2++) {
      var b = bricks[_c2][_r2];

      if (b.status == 1) {
        if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y - ballRadius > b.y - brickHeight && y - ballRadius < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;

          if (score == brickRowCount * brickColumnCount) {
            alert("C'est gagné, Bravo!");
            document.location.reload();
          }
        }
      }
    }
  }
};

var mouseMoveHandler = function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;

  if (relativeX - paddleWidth / 2 > 0 && relativeX < canvas.width - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
};

var game = function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  x += dx;
  y += dy;

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      vies--;

      if (!vies) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        alert("Il vous reste : " + vies + " vie(s)");
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX += 7;

    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;

    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives(); // Lancer la fonction en boucle

  requestAnimationFrame(game);
};

keyDownHandler = function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
};

keyUpHandler = function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
game();
console.log("Script loaded");