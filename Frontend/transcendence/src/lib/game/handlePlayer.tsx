import { Direction, DirY, DirX } from "@/lib/game/pongUtils";

export function initPlayer(
  gameWidth: number,
  gameHeight: number,
  playerSide: "left" | "right",
  difficulty: number
): Player {
  const player: Player = {
    pos: { x: 0, y: 0 },
    width: 14,
    height: 140,
    speed: 8 + difficulty,
    move: Direction.Idle,
    color: "#FFFFFF",
    score: 0,
    push: 0,
    side: playerSide,
    roundWon: 0,
  };
  player.pos.x =
    playerSide === "left" ? player.width * 3 : gameWidth - player.width * 4;
  player.pos.y = gameHeight / 2 - player.height / 2;

  return player;
}

function handlePush(player: Player): void {
  if (player.push > 0 && player.push <= 3) {
    player.push++;
    player.pos.x += player.side === "left" ? 5 : -5;
  } else if (player.push > 3 && player.push <= 6) {
    player.push++;
    player.pos.x += player.side === "left" ? -5 : 5;
    if (player.push === 7) {
      player.push = 0;
    }
  }
}

export function updatePlayer(game: Game, player: Player): void {
  const { move, speed, pos, height } = player;

  if (move === Direction.Up) {
    pos.y -= speed;
  } else if (move === Direction.Down) {
    pos.y += speed;
  }

  // Limit player position within the game height
  pos.y = Math.max(0, Math.min(game.height - height, pos.y));
  handlePush(player);
}

export function moveAI(game: Game, player: Player, ball: Ball): void {
  // Calculate the target position for the paddle
  const targetY = ball.pos.y - player.height / 2;

  // Define the movement speeds based on the player's side
  const moveSlow = player.speed / 3;
  const moveFast = player.speed / 1.5;

  // Determine the movement direction and speed based on the ball's movement and the player's side
  let movementSpeed = moveSlow;
  if (
    (player.side === "left" && ball.moveX < DirX.Idle) ||
    (player.side === "right" && ball.moveX > DirX.Idle)
  ) {
    movementSpeed = moveFast;
  }

  // Move the player's paddle gradually towards the target position
  if (player.pos.y > targetY) {
    player.pos.y -= Math.min(movementSpeed, player.pos.y - targetY);
  } else if (player.pos.y < targetY) {
    player.pos.y += Math.min(movementSpeed, targetY - player.pos.y);
  }

  // Handle Push
  if (game.push) {
    const ballNearPlayerPaddle =
      ball.pos.x - ball.size <= player.pos.x + player.width &&
      ball.pos.x + ball.size * 2 >= player.pos.x &&
      ball.pos.y + ball.size >= player.pos.y &&
      ball.pos.y <= player.pos.y + player.height;
    if (ballNearPlayerPaddle && player.push === 0 && Math.random() > 0.33) {
      player.push = 1;
    }
    handlePush(player);
  }

  // Limit player position within the game height
  player.pos.y = Math.max(
    0,
    Math.min(game.height - player.height, player.pos.y)
  );
}
