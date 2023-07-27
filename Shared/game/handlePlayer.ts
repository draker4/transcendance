import {
  GameData,
  Ball,
  BallDynamic,
  Player,
  PlayerDynamic,
  DirXValues,
} from "@Shared/types/Game.types";

import {
  GAME_HEIGHT,
  BALL_SIZE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PUSH_SIZE,
} from "@Shared/constants/Game.constants";

export function handlePush(player: Player, playerDynamic: PlayerDynamic): void {
  if (playerDynamic.push > 0 && playerDynamic.push <= PUSH_SIZE / 2) {
    playerDynamic.push++;
    playerDynamic.posX += player.side === "Left" ? 5 : -5;
  } else if (
    playerDynamic.push > PUSH_SIZE / 2 &&
    playerDynamic.push <= PUSH_SIZE
  ) {
    playerDynamic.push++;
    playerDynamic.posX += player.side === "Left" ? -5 : 5;
    if (playerDynamic.push === PUSH_SIZE + 1) {
      playerDynamic.push = 0;
    }
  }
}

export function updatePlayer(
  player: Player,
  playerDynamic: PlayerDynamic
): void {
  if (playerDynamic.move === "Up") {
    playerDynamic.posY -= playerDynamic.speed;
  } else if (playerDynamic.move === "Down") {
    playerDynamic.posY += playerDynamic.speed;
  }

  // Limit player position within the game height
  playerDynamic.posY = Math.max(
    0,
    Math.min(GAME_HEIGHT - PLAYER_HEIGHT, playerDynamic.posY)
  );
  handlePush(player, playerDynamic);
}

export function moveAI(
  game: GameData,
  player: Player,
  playerDynamic: PlayerDynamic,
  ballDynamic: BallDynamic
): void {
  // Calculate the target position for the paddle
  const targetY = ballDynamic.posY - PLAYER_HEIGHT / 2;

  // Define the movement speeds based on the player's side
  const moveSlow = playerDynamic.speed / 3;
  const moveFast = playerDynamic.speed / 1.5;

  // Determine the movement direction and speed based on the ball's movement and the player's side
  let movementSpeed = moveSlow;
  if (
    (player.side === "Left" && ballDynamic.moveX < DirXValues.Idle) ||
    (player.side === "Right" && ballDynamic.moveX > DirXValues.Idle)
  ) {
    movementSpeed = moveFast;
  }

  // Move the player's paddle gradually towards the target position
  if (playerDynamic.posY > targetY) {
    playerDynamic.posY -= Math.min(movementSpeed, playerDynamic.posY - targetY);
  } else if (playerDynamic.posY < targetY) {
    playerDynamic.posY += Math.min(movementSpeed, targetY - playerDynamic.posY);
  }

  // Handle Push
  if (game.push) {
    const ballNearPlayerPaddle =
      ballDynamic.posX - BALL_SIZE <= playerDynamic.posX + PLAYER_WIDTH &&
      ballDynamic.posX + BALL_SIZE * 2 >= playerDynamic.posX &&
      ballDynamic.posY + BALL_SIZE >= playerDynamic.posY &&
      ballDynamic.posY <= playerDynamic.posY + PLAYER_HEIGHT;
    if (
      ballNearPlayerPaddle &&
      playerDynamic.push === 0 &&
      Math.random() > 0.33
    ) {
      playerDynamic.push = 1;
    }
    handlePush(player, playerDynamic);
  }

  // Limit playerDynamic position within the game height
  playerDynamic.posY = Math.max(
    0,
    Math.min(GAME_HEIGHT - PLAYER_HEIGHT, playerDynamic.posY)
  );
}
