import { turnDelayIsOver } from "@Shared/Game/pongUtils";
import { GameData, Player, Draw } from "@Shared/Game/Game.type";
import {
  FONT_MENU,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  BALL_SIZE,
  FONT_SCORE,
  FONT_TIMER,
} from "@Shared/Game/Game.constants";

function drawEndMenu(game: GameData, draw: Draw) {
  // Draw the menu background
  draw.context.fillStyle = game.color;
  draw.context.fillRect(
    draw.canvas.width / 2 - 100,
    draw.canvas.height / 2 - 40,
    200,
    80
  );

  // Draw the menu text;
  draw.context.fillStyle = game.fontColor;
  draw.context.font = FONT_MENU;
  draw.context.textAlign = "center";
  draw.context.fillText(
    game.result,
    draw.canvas.width / 2,
    draw.canvas.height / 2 - 10
  );
  draw.context.fillText(
    "Press Enter to restart",
    draw.canvas.width / 2,
    draw.canvas.height / 2 + 30
  );
}

function drawMenu(game: GameData, draw: Draw) {
  // Draw the menu background
  draw.context.fillStyle = game.color;
  draw.context.fillRect(
    draw.canvas.width / 2 - 100,
    draw.canvas.height / 2 - 40,
    200,
    80
  );

  // Draw the menu text;
  draw.context.fillStyle = game.fontColor;
  draw.context.font = FONT_MENU;
  draw.context.textAlign = "center";
  draw.context.fillText(
    "Press Enter to start / stop",
    draw.canvas.width / 2,
    draw.canvas.height / 2 + 10
  );
}

function drawPlayer(draw: Draw, player: Player) {
  const radius = 8; // Adjust the radius to control the roundness of the corners

  draw.context.fillStyle = `rgb(255, 0, 0)`;

  draw.context.beginPath();
  draw.context.moveTo(player.posX + radius, player.posY);
  draw.context.lineTo(player.posX + PLAYER_WIDTH - radius, player.posY);
  draw.context.arcTo(
    player.posX + PLAYER_WIDTH,
    player.posY,
    player.posX + PLAYER_WIDTH,
    player.posY + radius,
    radius
  );
  draw.context.lineTo(
    player.posX + PLAYER_WIDTH,
    player.posY + PLAYER_HEIGHT - radius
  );
  draw.context.arcTo(
    player.posX + PLAYER_WIDTH,
    player.posY + PLAYER_HEIGHT,
    player.posX + PLAYER_WIDTH - radius,
    player.posY + PLAYER_HEIGHT,
    radius
  );
  draw.context.lineTo(player.posX + radius, player.posY + PLAYER_HEIGHT);
  draw.context.arcTo(
    player.posX,
    player.posY + PLAYER_HEIGHT,
    player.posX,
    player.posY + PLAYER_HEIGHT - radius,
    radius
  );
  draw.context.lineTo(player.posX, player.posY + radius);
  draw.context.arcTo(
    player.posX,
    player.posY,
    player.posX + radius,
    player.posY,
    radius
  );
  draw.context.closePath();

  draw.context.fill();
}

function drawBall(game: GameData, draw: Draw) {
  draw.context.beginPath();
  draw.context.arc(
    game.ball.posX + BALL_SIZE / 2,
    game.ball.posY + BALL_SIZE / 2,
    BALL_SIZE / 2,
    0,
    Math.PI * 2
  );
  draw.context.fillStyle = game.ball.color;
  draw.context.fill();
  draw.context.closePath();
}

function drawNet(game: GameData, draw: Draw) {
  draw.context.beginPath();
  draw.context.setLineDash([7, 15]);
  draw.context.moveTo(
    draw.canvas.width / 2,
    draw.canvas.height - draw.canvas.height / 10
  );
  draw.context.lineTo(draw.canvas.width / 2, draw.canvas.height / 10);
  draw.context.lineWidth = 10;
  draw.context.strokeStyle = game.fontColor;
  draw.context.stroke();
}

function drawScore(draw: Draw, score: number, posX: number, posY: number) {
  draw.context.fillText(score.toString(), posX, posY);
}

function drawRound(
  draw: Draw,
  roundDraw: number,
  color: string,
  side: "left" | "Right"
) {
  draw.context.fillStyle = color;
  const sign = side === "left" ? -1 : 1;
  for (let i = 0; i < roundDraw; i++) {
    draw.context.beginPath();
    draw.context.arc(
      draw.canvas.width / 2 + 65 * sign + i * 35 * sign,
      32,
      10,
      0,
      Math.PI * 2
    );
    draw.context.fill();
    draw.context.closePath();
  }
}

function drawScoreTable(game: GameData, draw: Draw) {
  // Set font
  draw.context.fillStyle = game.fontColor;
  draw.context.font = FONT_SCORE;
  draw.context.textAlign = "center";

  // Draw Score
  drawScore(draw, game.playerLeft.score, draw.canvas.width / 4, 50);
  drawScore(
    draw,
    game.playerRight.score,
    draw.canvas.width / 4 + draw.canvas.width / 2,
    50
  );

  // Draw actual round
  if (game.maxRound > 1) {
    draw.context.font = FONT_MENU;
    draw.context.fillText(
      "Round " + game.actualRound,
      draw.canvas.width / 2,
      40
    );
  }

  // Draw player round won
  drawRound(draw, game.maxRound / 2, game.roundColor, "left");
  drawRound(draw, game.playerLeft.roundWon, game.roundWinColor, "left");
  drawRound(draw, game.maxRound / 2, game.roundColor, "Right");
  drawRound(draw, game.playerRight.roundWon, game.roundWinColor, "Right");
}

function drawTimer(game: GameData, draw: Draw) {
  // Draw the menu background
  draw.context.fillStyle = game.color;
  draw.context.fillRect(
    draw.canvas.width / 2 - 100,
    draw.canvas.height / 2 - 50,
    200,
    100
  );

  // Draw the menu text;
  draw.context.fillStyle = game.fontColor;
  draw.context.font = FONT_TIMER;
  draw.context.textAlign = "center";
  if (game.timer > 1) {
    const timer = game.timer - 1;
    draw.context.fillText(
      timer.toString(),
      draw.canvas.width / 2,
      draw.canvas.height / 2 + 40
    );
  } else {
    draw.context.fillText(
      "GO!",
      draw.canvas.width / 2,
      draw.canvas.height / 2 + 30
    );
  }
}

export default function drawPong(game: GameData, draw: Draw) {
  // Clear the Canvas
  draw.context.clearRect(0, 0, draw.canvas.width, draw.canvas.height);
  // Set the Canvas color
  draw.context.fillStyle = game.color;
  // Draw the background
  draw.context.fillRect(0, 0, draw.canvas.width, draw.canvas.height);

  // Draw the Player
  drawPlayer(draw, game.playerLeft);
  drawPlayer(draw, game.playerRight);

  // Draw the net (Line in the middle)
  drawNet(game, draw);

  // Draw the Score
  drawScoreTable(game, draw);

  if (game.status === "Finished") {
    drawEndMenu(game, draw);
  } else if (game.timer > 0) {
    drawTimer(game, draw);
  } else if (game.status != "Playing") {
    drawMenu(game, draw);
  } else if (turnDelayIsOver(game.timer)) {
    drawBall(game, draw);
  }
}
