import { turnDelayIsOver } from "@transcendence/shared/game/pongUtils";
import {
  GameData,
  Player,
  Draw,
  PlayerDynamic,
  RGBA,
} from "@transcendence/shared/types/Game.types";
import {
  FONT_MENU,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  FONT_SCORE,
  MENU_COLOR,
  GAME_WIDTH,
  GAME_HEIGHT,
} from "@transcendence/shared/constants/Game.constants";

function drawMenu(gameData: GameData, draw: Draw) {
  // Draw the menu background
  draw.context.fillStyle = MENU_COLOR;
  draw.context.fillRect(
    draw.canvas.width / 2 - 100,
    draw.canvas.height / 2 - 40,
    200,
    80
  );

  // Draw the menu text;
  const { r, g, b, a } = gameData.color.menu;
  draw.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  draw.context.font = FONT_MENU;
  draw.context.textAlign = "center";
  draw.context.fillText(
    "Press Enter to start / stop",
    draw.canvas.width / 2,
    draw.canvas.height / 2 + 10
  );
}

function drawPlayer(
  draw: Draw,
  player: Player | null,
  playerDynamic: PlayerDynamic
) {
  const radius = 8; // Adjust the radius to control the roundness of the corners

  if (!player) return;
  const { r, g, b } = player.color;
  draw.context.fillStyle = `rgb(${r}, ${g}, ${b})`;

  draw.context.beginPath();
  draw.context.moveTo(playerDynamic.posX + radius, playerDynamic.posY);
  draw.context.lineTo(
    playerDynamic.posX + PLAYER_WIDTH - radius,
    playerDynamic.posY
  );
  draw.context.arcTo(
    playerDynamic.posX + PLAYER_WIDTH,
    playerDynamic.posY,
    playerDynamic.posX + PLAYER_WIDTH,
    playerDynamic.posY + radius,
    radius
  );
  draw.context.lineTo(
    playerDynamic.posX + PLAYER_WIDTH,
    playerDynamic.posY + PLAYER_HEIGHT - radius
  );
  draw.context.arcTo(
    playerDynamic.posX + PLAYER_WIDTH,
    playerDynamic.posY + PLAYER_HEIGHT,
    playerDynamic.posX + PLAYER_WIDTH - radius,
    playerDynamic.posY + PLAYER_HEIGHT,
    radius
  );
  draw.context.lineTo(
    playerDynamic.posX + radius,
    playerDynamic.posY + PLAYER_HEIGHT
  );
  draw.context.arcTo(
    playerDynamic.posX,
    playerDynamic.posY + PLAYER_HEIGHT,
    playerDynamic.posX,
    playerDynamic.posY + PLAYER_HEIGHT - radius,
    radius
  );
  draw.context.lineTo(playerDynamic.posX, playerDynamic.posY + radius);
  draw.context.arcTo(
    playerDynamic.posX,
    playerDynamic.posY,
    playerDynamic.posX + radius,
    playerDynamic.posY,
    radius
  );
  draw.context.closePath();

  draw.context.fill();
}

function drawBall(gameData: GameData, draw: Draw) {
  draw.context.drawImage(
    draw.ballImage,
    gameData.ball.posX,
    gameData.ball.posY
  );
}

function drawScore(draw: Draw, score: number, posX: number, posY: number) {
  draw.context.fillText(score.toString(), posX, posY);
}

function drawRound(
  draw: Draw,
  roundDraw: number,
  color: RGBA,
  side: "left" | "Right"
) {
  const { r, g, b, a } = color;
  draw.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
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

function drawScoreTable(gameData: GameData, draw: Draw) {
  // Set font
  const { r, g, b, a } = gameData.color.font;
  draw.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  draw.context.font = FONT_SCORE;
  draw.context.textAlign = "center";

  // Draw Score
  drawScore(
    draw,
    gameData.score.round[gameData.actualRound].left,
    draw.canvas.width / 4,
    50
  );
  drawScore(
    draw,
    gameData.score.round[gameData.actualRound].right,
    draw.canvas.width / 4 + draw.canvas.width / 2,
    50
  );

  // Draw actual round
  if (gameData.maxRound > 1) {
    draw.context.font = FONT_MENU;
    draw.context.fillText(
      "Round " + gameData.actualRound,
      draw.canvas.width / 2,
      40
    );
  }

  // Draw player round won
  drawRound(draw, gameData.maxRound / 2, gameData.color.font, "left");
  drawRound(draw, gameData.score.leftRound, gameData.color.roundWon, "left");
  drawRound(draw, gameData.maxRound / 2, gameData.color.font, "Right");
  drawRound(draw, gameData.score.rightRound, gameData.color.roundWon, "Right");
}

// function drawTimer(gameData: GameData, draw: Draw) {
//   // Draw the menu background
//   draw.context.fillStyle = gameData.color;
//   draw.context.fillRect(
//     draw.canvas.width / 2 - 100,
//     draw.canvas.height / 2 - 50,
//     200,
//     100
//   );

//   // Draw the menu text;
//   draw.context.fillStyle = gameData.fontColor;
//   draw.context.font = FONT_TIMER;
//   draw.context.textAlign = "center";
//   if (gameData.timer > 1) {
//     const timer = gameData.timer - 1;
//     draw.context.fillText(
//       timer.toString(),
//       draw.canvas.width / 2,
//       draw.canvas.height / 2 + 40
//     );
//   } else {
//     draw.context.fillText(
//       "GO!",
//       draw.canvas.width / 2,
//       draw.canvas.height / 2 + 30
//     );
//   }
// }

export function drawPong(gameData: GameData, draw: Draw) {
  // Clear the Canvas
  draw.context.clearRect(0, 0, draw.canvas.width, draw.canvas.height);
  // Draw the background image
  draw.context.drawImage(draw.backgroundImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw the Player
  drawPlayer(draw, gameData.playerLeft, gameData.playerLeftDynamic);
  drawPlayer(draw, gameData.playerRight, gameData.playerRightDynamic);

  // Draw the Score
  drawScoreTable(gameData, draw);

  // draw the ball
  drawBall(gameData, draw);
}
