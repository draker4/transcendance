import { DirX, DirY } from "@/lib/Game/pongUtils";

export function initBall(
  gameWidth: number,
  gameHeight: number,
  difficulty: number
): Ball {
  const ball: Ball = {
    pos: { x: gameWidth / 2 - 5, y: gameHeight / 2 - 5 },
    size: 16,
    speed: 10 + difficulty,
    moveX: DirX.Idle,
    moveY: DirY.Idle,
    color: "#FFFFFF",
    push: 0,
  };

  return ball;
}

export function resetBall(ball: Ball, game: Game): void {
  ball.pos.x = game.width / 2;
  ball.pos.y = game.height / 2;
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
  const relativeIntersectY = posY + height / 2 - (ball.pos.y + ball.size / 2);
  const normalIntersectY = relativeIntersectY / (height / 2);
  const bounceAngle = normalIntersectY * 45;
  return bounceAngle * (Math.PI / 180);
}

function handlePlayerCollision(ball: Ball, player: Player): void {
  const margin = ball.speed * 1.5;
  if (
    (player.side === "left" &&
      ball.pos.x >= player.pos.x + player.width - margin / 2 &&
      ball.pos.x <= player.pos.x + player.width + margin / 2) ||
    (player.side === "right" &&
      ball.pos.x + ball.size >= player.pos.x - margin / 2 &&
      ball.pos.x + ball.size <= player.pos.x + margin / 2)
  ) {
    if (
      ball.pos.y + ball.size >= player.pos.y &&
      ball.pos.y <= player.pos.y + player.height
    ) {
      const newAngle = calculateBallAngle(ball, player.pos.y, player.height);
      const newMoveX = Math.cos(newAngle);
      if (Math.sign(ball.moveX) === Math.sign(newMoveX)) {
        ball.moveX = -1 * newMoveX;
      } else {
        ball.moveX = newMoveX;
      }
      ball.moveY = -Math.sin(newAngle);
      handlePush(ball, player);
    } else if (
      ball.pos.y + ball.size >= player.pos.y - margin &&
      ball.pos.y + ball.size < player.pos.y &&
      ball.moveY < DirY.Idle
    ) {
      ball.moveY *= -1;
    } else if (
      ball.pos.y > player.pos.y + player.width &&
      ball.pos.y < player.pos.y + player.width + margin &&
      ball.moveY > DirY.Idle
    ) {
      ball.moveY *= -1;
    }
  }
}

export function updateBall(ball: Ball, game: Game): string {
  // Handle Player collisions
  if (ball.moveX < DirX.Idle) {
    handlePlayerCollision(ball, game.playerLeft);
  } else if (ball.moveX > DirX.Idle) {
    handlePlayerCollision(ball, game.playerRight);
  }

  // Move ball in intended direction based on moveY and moveX values
  ball.pos.y += ball.moveY * ball.speed;
  ball.pos.x += ball.moveX * ball.speed;

  // Handle Wall collisions
  if (ball.pos.x <= 0) {
    return "reset left";
  } else if (ball.pos.x >= game.width - ball.size) {
    return "reset right";
  }
  if (ball.pos.y <= 0) {
    ball.moveY *= -1;
    ball.pos.y = 1;
  } else if (ball.pos.y >= game.height - ball.size) {
    ball.moveY *= -1;
    ball.pos.y = game.height - ball.size - 1;
  }
  return "Ball updated";
}

export function handleServe(ball: Ball, game: Game): void {
  ball.moveX = game.playerServe === "left" ? DirX.Right : DirX.Left;
  if (Math.random() < 0.5) {
    ball.moveY = DirY.Up;
  } else {
    ball.moveY = DirY.Down;
  }
  var pos = Math.random() * (game.height / 2 - ball.size);
  if (Math.random() < 0.5) pos *= -1;
  const newAngle = calculateBallAngle(ball, pos, game.height);
  const newMoveX = Math.cos(newAngle);
  if (Math.sign(ball.moveX) === Math.sign(newMoveX)) {
    ball.moveX = -1 * newMoveX;
  } else {
    ball.moveX = newMoveX;
  }
  ball.moveY = -Math.sin(newAngle);
  game.playerServe = null;
}
