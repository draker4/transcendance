import {
  GameData,
  Ball,
  Player,
  PlayerDynamic,
  DirXValues,
} from "@transcendence/shared/types/Game.types";

import {
  GAME_HEIGHT,
  BALL_SIZE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PUSH_SIZE,
} from "@transcendence/shared/constants/Game.constants";

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
  Ball: Ball
): void {
  if (game.timer.end > new Date().getTime()) return;
  // Estimate when the ball will cross the AI's side of the court
  const timeToReachAI = Math.abs((playerDynamic.posX - Ball.posX) / Ball.moveX);
  const predictedBallPosY = Ball.posY + Ball.moveY * timeToReachAI;

  // Calculate the target position considering the predicted ball position
  const targetYWithPrediction = predictedBallPosY - PLAYER_HEIGHT / 2;

  // Calculate the distance between the current position and target position
  const distanceToTarget = Math.abs(playerDynamic.posY - targetYWithPrediction);

  // Calculate a variable movement speed based on the distance
  const maxSpeed = playerDynamic.speed;
  const minSpeed = playerDynamic.speed / 3;
  const movementSpeed =
    minSpeed +
    ((maxSpeed - minSpeed) * distanceToTarget) / (GAME_HEIGHT - PLAYER_HEIGHT);

  // Move the player's paddle gradually towards the target position
  if (playerDynamic.posY > targetYWithPrediction + PLAYER_HEIGHT / 3) {
    playerDynamic.posY -= Math.min(
      movementSpeed,
      playerDynamic.posY - targetYWithPrediction
    );
  } else if (playerDynamic.posY < targetYWithPrediction - PLAYER_HEIGHT / 3) {
    playerDynamic.posY += Math.min(
      movementSpeed,
      targetYWithPrediction - playerDynamic.posY
    );
  }

  // Handle Push
  if (game.push) {
    const ballNearPlayerPaddle =
      Ball.posX - BALL_SIZE <= playerDynamic.posX + PLAYER_WIDTH &&
      Ball.posX + BALL_SIZE * 2 >= playerDynamic.posX &&
      Ball.posY + BALL_SIZE >= playerDynamic.posY &&
      Ball.posY <= playerDynamic.posY + PLAYER_HEIGHT;
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
