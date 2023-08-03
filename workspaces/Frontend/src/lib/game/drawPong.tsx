import { turnDelayIsOver } from "@transcendence/shared/game/pongUtils";
import {
  GameData,
  Player,
  Draw,
  PlayerDynamic,
  RGBA,
  Timer,
} from "@transcendence/shared/types/Game.types";
import {
  FONT_MENU,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  FONT_SCORE,
  MENU_COLOR,
  GAME_WIDTH,
  GAME_HEIGHT,
  FONT_TIMER,
  FONT_ROUND,
} from "@transcendence/shared/constants/Game.constants";

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
      draw.canvas.width / 2 + 140 * sign + i * 35 * sign,
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
  let actualRound = gameData.actualRound;
  if (gameData.status === "Finished") {
    actualRound--;
  }

  // Draw Score
  drawScore(
    draw,
    gameData.score.round[actualRound].left,
    draw.canvas.width / 4,
    50
  );
  drawScore(
    draw,
    gameData.score.round[actualRound].right,
    draw.canvas.width / 4 + draw.canvas.width / 2,
    50
  );

  // Draw actual round
  if (gameData.maxRound > 1) {
    draw.context.font = FONT_ROUND;
    draw.context.fillText("Round " + actualRound, draw.canvas.width / 2, 45);
  }

  // Draw player round won
  drawRound(draw, gameData.maxRound / 2, gameData.color.font, "left");
  drawRound(draw, gameData.score.leftRound, gameData.color.roundWon, "left");
  drawRound(draw, gameData.maxRound / 2, gameData.color.font, "Right");
  drawRound(draw, gameData.score.rightRound, gameData.color.roundWon, "Right");
}

function applyBlurEffect(draw: Draw) {
  const overlayColor = "rgba(0, 0, 0, 0.5)"; // Adjust the color and opacity as needed
  draw.context.fillStyle = overlayColor;
  draw.context.fillRect(0, 0, draw.canvas.width, draw.canvas.height);
}

function startingMenu(gameData: GameData, draw: Draw) {
  applyBlurEffect(draw);
  const { r, g, b, a } = gameData.color.font;
  draw.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  draw.context.font = FONT_MENU;
  draw.context.textAlign = "center";
  draw.context.fillText(
    "Waiting for Player",
    draw.canvas.width / 2,
    draw.canvas.height / 2 + 10
  );
}

function finishedMenu(gameData: GameData, draw: Draw) {
  applyBlurEffect(draw);
  const { r, g, b, a } = gameData.color.font;
  draw.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  draw.context.font = FONT_MENU;
  draw.context.textAlign = "center";
  const winner =
    gameData.score.leftRound > gameData.score.rightRound
      ? gameData.playerLeft.name
      : gameData.playerRight.name;
  draw.context.fillText(
    `${winner} has won!`,
    draw.canvas.width / 2,
    draw.canvas.height / 2 + 10
  );
}

function drawTimer(timer: Timer, color: RGBA, draw: Draw, round: number) {
  // remove 2h from the timer
  const actualTime = new Date().getTime();

  if (actualTime <= timer.end) {
    applyBlurEffect(draw);
    const { r, g, b, a } = color;
    draw.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    draw.context.font = FONT_TIMER;
    draw.context.textAlign = "center";
    //define the time difference between both dates
    const timerDif = timer.end - actualTime;
    const showTimer = Math.floor(timerDif / 1000);

    // Draw timer reason
    let reason: string = timer.reason;
    if (timer.reason === "Pause") {
      reason = `${timer.playerName} as requested a Break`;
    } else if (timer.reason === "Deconnection") {
      reason = `${timer.playerName} has been deconnected`;
    } else if (timer.reason === "Round") {
      reason = `Round ${round} is starting`;
    } else if (timer.reason === "Start") {
      reason = `Game is starting`;
    } else if (timer.reason === "ReStart") {
      reason = `Prepare for Restart`;
    }
    draw.context.fillText(
      reason,
      draw.canvas.width / 2,
      draw.canvas.height / 2 - 20
    );

    // Draw timer
    if (showTimer > 0) {
      draw.context.fillText(
        showTimer.toString() + "s",
        draw.canvas.width / 2,
        draw.canvas.height / 2 + 50
      );
    } else if (showTimer === 0) {
      draw.context.fillText(
        "GO!",
        draw.canvas.width / 2,
        draw.canvas.height / 2 + 50
      );
    }
  }
}

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

  // Draw the Timer
  if (gameData.timer)
    drawTimer(
      gameData.timer,
      gameData.color.font,
      draw,
      gameData.actualRound + 1
    );

  // Draw the ball
  if (gameData.status === "Playing") drawBall(gameData, draw);

  // Draw the menu
  if (gameData.status === "Not Started") startingMenu(gameData, draw);
  if (gameData.status === "Finished") finishedMenu(gameData, draw);
}
