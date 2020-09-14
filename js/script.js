/* jshint esversion: 6 */
console.log("Script begin ...");

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

/* Config général du jeu */
let vitesse = 15; //vitesse ms
let cheat = 0; // 0 ... 5 max
let vies = 3; // Nombre de vies du joueur
/* end */

/* Propriétés de la Balle */
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
/* end */

/* Propriétés de la Raquette */
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
/* end */

/* Propriétés des Briques */
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 40;
let brickOffsetLeft = 30;
let score = 0;
/* end */

/* Tableau des briques */
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
/* end */

// Affichage de la balle
const drawBall = (color = "red") => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};
/* end */

/* Affichage de la raquette */
const drawPaddle = (color = " green") => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};
/* end */

/* Affichage des briques */
const drawBricks = (color = "blue") => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};
/* end */

/* Affichage du score */
const drawScore = (color = "green") => {
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = color;
  ctx.fillText("Score: " + score, 30, 30);
};
/* end */

/* Affichage du nombre de vies */
const drawLives = (color = "green") => {
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = color;
  ctx.fillText("Vies: " + vies, canvas.width - 90, 30);
};
/* end */

/* Détection des colisions de la balle avec les briques */
const collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x + ballRadius > b.x &&
          x - ballRadius < b.x + brickWidth &&
          y - ballRadius > b.y - brickHeight &&
          y - ballRadius < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("C'est gagné, Bravo!");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
};
/* end */

/* Conditions du jeu - Comportement de la balle */
const rule = () => {
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
      //Conditions pour gagner ou perdre
      vies--;
      if (!vies) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
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
};
/* end */

/* Déplacement de la balle */
const remote = () => {
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
}
/* end */


/* Controles */
const keyDownHandler = document.addEventListener(
  "keydown",
  (e) => {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  },
  false
);
const keyUpHandler = document.addEventListener(
  "keyup",
  (e) => {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  },
  false
);
const mouseMoveHandler = document.addEventListener(
  "mousemove",
  (e) => {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (
      relativeX - paddleWidth / 2 > 0 &&
      relativeX < canvas.width - paddleWidth / 2
    ) {
      paddleX = relativeX - paddleWidth / 2;
    }
  },
  false
);
/* end */


/* Le jeu */
const game = setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  rule();
  collisionDetection();
  remote();
}, vitesse);
/* end */

console.log("Script loaded");
