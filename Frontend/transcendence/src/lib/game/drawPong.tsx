import { turnDelayIsOver } from "@/lib/game/pongUtils";

function drawEndMenu(game: Game) {
  // Draw the menu background
  game.context.fillStyle = game.color;
  game.context.fillRect(
    game.canvas.width / 2 - 100,
    game.canvas.height / 2 - 40,
    200,
    80
  );

  // Draw the menu text;
  game.context.fillStyle = game.fontColor;
  game.context.font = game.menuFont;
  game.context.textAlign = "center";
  game.context.fillText(
    game.result,
    game.canvas.width / 2,
    game.canvas.height / 2 - 10
  );
  game.context.fillText(
    "Press Enter to restart",
    game.canvas.width / 2,
    game.canvas.height / 2 + 30
  );
}

function drawMenu(game: Game) {
  // Draw the menu background
  game.context.fillStyle = game.color;
  game.context.fillRect(
    game.canvas.width / 2 - 100,
    game.canvas.height / 2 - 40,
    200,
    80
  );

  // Draw the menu text;
  game.context.fillStyle = game.fontColor;
  game.context.font = game.menuFont;
  game.context.textAlign = "center";
  game.context.fillText(
    "Press Enter to start / stop",
    game.canvas.width / 2,
    game.canvas.height / 2 + 10
  );
}

function drawPlayer(game: Game, player: Player) {
  const radius = 8; // Adjust the radius to control the roundness of the corners

  game.context.fillStyle = `rgb(255, 0, 0)`;

  game.context.beginPath();
  game.context.moveTo(player.pos.x + radius, player.pos.y);
  game.context.lineTo(player.pos.x + player.width - radius, player.pos.y);
  game.context.arcTo(
    player.pos.x + player.width,
    player.pos.y,
    player.pos.x + player.width,
    player.pos.y + radius,
    radius
  );
  game.context.lineTo(
    player.pos.x + player.width,
    player.pos.y + player.height - radius
  );
  game.context.arcTo(
    player.pos.x + player.width,
    player.pos.y + player.height,
    player.pos.x + player.width - radius,
    player.pos.y + player.height,
    radius
  );
  game.context.lineTo(player.pos.x + radius, player.pos.y + player.height);
  game.context.arcTo(
    player.pos.x,
    player.pos.y + player.height,
    player.pos.x,
    player.pos.y + player.height - radius,
    radius
  );
  game.context.lineTo(player.pos.x, player.pos.y + radius);
  game.context.arcTo(
    player.pos.x,
    player.pos.y,
    player.pos.x + radius,
    player.pos.y,
    radius
  );
  game.context.closePath();

  game.context.fill();
}

function drawBall(game: Game) {
  game.context.beginPath();
  game.context.arc(
    game.ball.pos.x + game.ball.size / 2,
    game.ball.pos.y + game.ball.size / 2,
    game.ball.size / 2,
    0,
    Math.PI * 2
  );
  game.context.fillStyle = game.ball.color;
  game.context.fill();
  game.context.closePath();
}

function drawNet(game: Game) {
  game.context.beginPath();
  game.context.setLineDash([7, 15]);
  game.context.moveTo(
    game.canvas.width / 2,
    game.canvas.height - game.canvas.height / 10
  );
  game.context.lineTo(game.canvas.width / 2, game.canvas.height / 10);
  game.context.lineWidth = 10;
  game.context.strokeStyle = game.fontColor;
  game.context.stroke();
}

function drawScore(game: Game, score: number, posX: number, posY: number) {
  game.context.fillText(score.toString(), posX, posY);
}

function drawRound(
  game: Game,
  roundDraw: number,
  color: string,
  side: "left" | "right"
) {
  game.context.fillStyle = color;
  const sign = side === "left" ? -1 : 1;
  for (let i = 0; i < roundDraw; i++) {
    game.context.beginPath();
    game.context.arc(
      game.canvas.width / 2 + 65 * sign + i * 35 * sign,
      32,
      10,
      0,
      Math.PI * 2
    );
    game.context.fill();
    game.context.closePath();
  }
}

function drawScoreTable(game: Game) {
  // Set font
  game.context.fillStyle = game.fontColor;
  game.context.font = game.scoreFont;
  game.context.textAlign = "center";

  // Draw Score
  drawScore(game, game.playerLeft.score, game.canvas.width / 4, 50);
  drawScore(
    game,
    game.playerRight.score,
    game.canvas.width / 4 + game.canvas.width / 2,
    50
  );

  // Draw actual round
  if (game.roundMax > 1) {
    game.context.font = game.menuFont;
    game.context.fillText("Round " + game.round, game.canvas.width / 2, 40);
  }

  // Draw player round won
  drawRound(game, game.roundMax / 2, game.roundColor, "left");
  drawRound(game, game.playerLeft.roundWon, game.roundWinColor, "left");
  drawRound(game, game.roundMax / 2, game.roundColor, "right");
  drawRound(game, game.playerRight.roundWon, game.roundWinColor, "right");
}

function drawTimer(game: Game) {
  // Draw the menu background
  game.context.fillStyle = game.color;
  game.context.fillRect(
    game.canvas.width / 2 - 100,
    game.canvas.height / 2 - 50,
    200,
    100
  );

  // Draw the menu text;
  game.context.fillStyle = game.fontColor;
  game.context.font = game.timerFont;
  game.context.textAlign = "center";
  if (game.startTimer > 1) {
    const timer = game.startTimer - 1;
    game.context.fillText(
      timer.toString(),
      game.canvas.width / 2,
      game.canvas.height / 2 + 40
    );
  } else {
    game.context.fillText(
      "GO!",
      game.canvas.width / 2,
      game.canvas.height / 2 + 30
    );
  }
}

export default function drawPong(game: Game) {
  // Clear the Canvas
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  // Set the Canvas color
  game.context.fillStyle = game.color;
  // Draw the background
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

  // Draw the Player
  drawPlayer(game, game.playerLeft);
  drawPlayer(game, game.playerRight);

  // Draw the net (Line in the middle)
  drawNet(game);

  // Draw the Score
  drawScoreTable(game);

  if (game.over) {
    drawEndMenu(game);
  } else if (game.startTimer > 0) {
    drawTimer(game);
  } else if (!game.running) {
    drawMenu(game);
  } else if (turnDelayIsOver(game.timer)) {
    drawBall(game);
  }
}
