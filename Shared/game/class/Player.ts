import { Action, DirX, Player, GameData, Ball } from "@Shared/types/Game.types";
import {
  GAME_HEIGHT,
  BALL_SIZE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from "@Shared/constants/Game.constants";

export function initPlayer(
  gameWidth: number,
  gameHeight: number,
  playerSide: "Left" | "Right",
  difficulty: number
): Player {
  const player: Player = {
    id: 0,
    name: "",
    posX: 0,
    posY: 0,
    speed: 8 + difficulty,
    move: "Idle",
    color: "#FFFFFF",
    push: 0,
    side: playerSide,
    status: "Connected",
  };
  player.posX =
    playerSide === "Left" ? PLAYER_WIDTH * 3 : gameWidth - PLAYER_WIDTH * 4;
  player.posY = gameHeight / 2 - PLAYER_HEIGHT / 2;

  return player;
}

function handlePush(player: Player): void {
  if (player.push > 0 && player.push <= 3) {
    player.push++;
    player.posX += player.side === "Left" ? 5 : -5;
  } else if (player.push > 3 && player.push <= 6) {
    player.push++;
    player.posX += player.side === "Left" ? -5 : 5;
    if (player.push === 7) {
      player.push = 0;
    }
  }
}

export function updatePlayer(player: Player): void {
  if (player.move === "Up") {
    player.posY -= player.speed;
  } else if (player.move === "Down") {
    player.posY += player.speed;
  }

  // Limit player position within the game height
  player.posY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_HEIGHT, player.posY));
  handlePush(player);
}

export function moveAI(game: GameData, player: Player, ball: Ball): void {
  // Calculate the target position for the paddle
  const targetY = ball.posY - PLAYER_HEIGHT / 2;

  // Define the movement speeds based on the player's side
  const moveSlow = player.speed / 3;
  const moveFast = player.speed / 1.5;

  // Determine the movement direction and speed based on the ball's movement and the player's side
  let movementSpeed = moveSlow;
  if (
    (player.side === "Left" && ball.moveX < DirX.Idle) ||
    (player.side === "Right" && ball.moveX > DirX.Idle)
  ) {
    movementSpeed = moveFast;
  }

  // Move the player's paddle gradually towards the target position
  if (player.posY > targetY) {
    player.posY -= Math.min(movementSpeed, player.posY - targetY);
  } else if (player.posY < targetY) {
    player.posY += Math.min(movementSpeed, targetY - player.posY);
  }

  // Handle Push
  if (game.push) {
    const ballNearPlayerPaddle =
      ball.posX - BALL_SIZE <= player.posX + PLAYER_WIDTH &&
      ball.posX + BALL_SIZE * 2 >= player.posX &&
      ball.posY + BALL_SIZE >= player.posY &&
      ball.posY <= player.posY + PLAYER_HEIGHT;
    if (ballNearPlayerPaddle && player.push === 0 && Math.random() > 0.33) {
      player.push = 1;
    }
    handlePush(player);
  }

  // Limit player position within the game height
  player.posY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_HEIGHT, player.posY));
}
