import { DirX, DirY, Ball, GameData, Player } from "@Shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  BALL_SIZE,
  BALL_START_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from "@Shared/constants/Game.constants";

export function initBall(difficulty: number): Ball {
  const ball: Ball = {
    posX: GAME_WIDTH / 2 - 5,
    posY: GAME_HEIGHT / 2 - 5,
    speed: BALL_START_SPEED + difficulty,
    moveX: DirX.Idle,
    moveY: DirY.Idle,
    color: "#FFFFFF",
    push: 0,
    img: null,
  };

  return ball;
}

export function resetBall(ball: Ball, game: GameData): void {
  ball.posX = GAME_WIDTH / 2;
  ball.posY = GAME_HEIGHT / 2;
  ball.moveX = DirX.Idle;
  ball.moveY = DirY.Idle;
  while (ball.push > 0) {
    ball.push--;
    ball.speed -= 1;
  }
}

function handlePush(ball: Ball, player: Player): void {
  if (player.push > 0 && player.push <= 5) {
    ball.push++;
    ball.speed += 1;
  } else if (ball.push > 0) {
    ball.push--;
    ball.speed -= 1;
  }
}

function calculateBallAngle(ball: Ball, posY: number, height: number): number {
  const relativeIntersectY = posY + height / 2 - (ball.posY + BALL_SIZE / 2);
  const normalIntersectY = relativeIntersectY / (height / 2);
  const bounceAngle = normalIntersectY * 45;
  return bounceAngle * (Math.PI / 180);
}

function handlePlayerCollision(ball: Ball, player: Player): void {
  const margin = ball.speed * 1.5;
  if (
    (player.side === "Left" &&
      ball.posX >= player.posX + PLAYER_WIDTH - margin / 2 &&
      ball.posX <= player.posX + PLAYER_WIDTH + margin / 2) ||
    (player.side === "Right" &&
      ball.posX + BALL_SIZE >= player.posX - margin / 2 &&
      ball.posX + BALL_SIZE <= player.posX + margin / 2)
  ) {
    if (
      ball.posY + BALL_SIZE >= player.posY &&
      ball.posY <= player.posY + PLAYER_HEIGHT
    ) {
      const newAngle = calculateBallAngle(ball, player.posY, PLAYER_HEIGHT);
      const newMoveX = Math.cos(newAngle);
      if (Math.sign(ball.moveX) === Math.sign(newMoveX)) {
        ball.moveX = -1 * newMoveX;
      } else {
        ball.moveX = newMoveX;
      }
      ball.moveY = -Math.sin(newAngle);
      handlePush(ball, player);
    } else if (
      ball.posY + BALL_SIZE >= player.posY - margin &&
      ball.posY + BALL_SIZE < player.posY &&
      ball.moveY < DirY.Idle
    ) {
      ball.moveY *= -1;
    } else if (
      ball.posY > player.posY + PLAYER_WIDTH &&
      ball.posY < player.posY + PLAYER_WIDTH + margin &&
      ball.moveY > DirY.Idle
    ) {
      ball.moveY *= -1;
    }
  }
}

export function updateBall(ball: Ball, game: GameData): string {
  // Handle Player collisions
  if (ball.moveX < DirX.Idle) {
    handlePlayerCollision(ball, game.playerLeft);
  } else if (ball.moveX > DirX.Idle) {
    handlePlayerCollision(ball, game.playerRight);
  }

  // Move ball in intended direction based on moveY and moveX values
  ball.posY += ball.moveY * ball.speed;
  ball.posX += ball.moveX * ball.speed;

  // Handle Wall collisions
  if (ball.posX <= 0) {
    return "reset Left";
  } else if (ball.posX >= GAME_WIDTH - BALL_SIZE) {
    return "reset Right";
  }
  if (ball.posY <= 0) {
    ball.moveY *= -1;
    ball.posY = 1;
  } else if (ball.posY >= GAME_HEIGHT - BALL_SIZE) {
    ball.moveY *= -1;
    ball.posY = GAME_HEIGHT - BALL_SIZE - 1;
  }
  return "Ball updated";
}

export function handleServe(ball: Ball, game: GameData): void {
  ball.moveX = game.playerServe === "Left" ? DirX.Right : DirX.Left;
  if (Math.random() < 0.5) {
    ball.moveY = DirY.Up;
  } else {
    ball.moveY = DirY.Down;
  }
  var pos = Math.random() * (GAME_HEIGHT / 2 - BALL_SIZE);
  if (Math.random() < 0.5) pos *= -1;
  const newAngle = calculateBallAngle(ball, pos, GAME_HEIGHT);
  const newMoveX = Math.cos(newAngle);
  if (Math.sign(ball.moveX) === Math.sign(newMoveX)) {
    ball.moveX = -1 * newMoveX;
  } else {
    ball.moveX = newMoveX;
  }
  ball.moveY = -Math.sin(newAngle);
  game.playerServe = null;
}
