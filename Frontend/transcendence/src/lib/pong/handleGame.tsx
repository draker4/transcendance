import { initBall } from "@/lib/pong/handleBall";
import { initPlayer } from "@/lib/pong/handlePlayer";
import drawPong from "@/lib/pong/drawPong";
import updatePong from "@/lib/pong/updatePong";

export function initGame(canvasRef: HTMLCanvasElement, pong: Pong): Game {
  var game: Game = {
    canvas: canvasRef,
    context: canvasRef.getContext("2d")!,
    width: canvasRef.width,
    height: canvasRef.height,
    color: "#000000",
    fontColor: "#FFFFFF",
    roundColor: "#FFFFFF",
    roundWinColor: "#00FF00",
    menuFont: "20px Arial",
    scoreFont: "50px Arial",
    timerFont: "100px Arial",
    result: "",
    round: 1,
    roundPoint: pong.score,
    roundMax: pong.round,
    difficulty: pong.difficulty,
    startTimer: 6,
    over: false,
    running: false,
    playerSide: pong.side,
    AI: pong.AI,
    push: pong.push,
  } as Game;
  game.playerLeft = initPlayer(
    game.width,
    game.height,
    "left",
    pong.difficulty - 1
  );
  game.playerRight = initPlayer(
    game.width,
    game.height,
    "right",
    pong.difficulty - 1
  );
  game.ball = initBall(game.width, game.height, pong.difficulty - 1);
  game.timer = new Date().getTime();
  if (Math.random() < 0.5) {
    game.playerServe = "left";
  } else {
    game.playerServe = "right";
  }
  handleStartTimer(game);
  return game;
}

export function resetGame(game: Game) {
  game.color = "#000000";
  game.round = 1;
  game.over = false;
  game.running = false;
  game.startTimer = 6;
  game.playerLeft = initPlayer(
    game.width,
    game.height,
    "left",
    game.difficulty
  );
  game.playerRight = initPlayer(
    game.width,
    game.height,
    "right",
    game.difficulty
  );
  game.ball = initBall(game.width, game.height, game.difficulty);
  game.timer = new Date().getTime();
  if (Math.random() < 0.5) {
    game.playerServe = "left";
  } else {
    game.playerServe = "right";
  }
  handleStartTimer(game);
}

const lastTimestampRef = { current: 0 };
const lastFpsUpdateTimeRef = { current: 0 };
const frameCountRef = { current: 0 };
const fpsRef = { current: 0 };
const showFpsRef = false;

export const gameLoop = (timestamp: number, game: Game) => {
  const elapsedTime = timestamp - lastTimestampRef.current;
  frameCountRef.current++;

  if (elapsedTime >= 16.67) {
    if (game.running && !game.over) {
      updatePong(game);
    }
    drawPong(game);

    lastTimestampRef.current = timestamp;
  }

  const currentTime = performance.now();
  const elapsedFpsTime = currentTime - lastFpsUpdateTimeRef.current;

  if (elapsedFpsTime >= 1000) {
    // Calculate FPS
    fpsRef.current = Math.round(
      (frameCountRef.current * 1000) / elapsedFpsTime
    );

    // Display FPS
    if (showFpsRef) console.log("FPS:", fpsRef.current);

    frameCountRef.current = 0;
    lastFpsUpdateTimeRef.current = currentTime;
  }

  const targetDelay = 1000 / 70; // 60 FPS
  const remainingDelay = Math.max(
    targetDelay - (performance.now() - timestamp),
    0
  );
  setTimeout(() => {
    requestAnimationFrame((timestamp) => gameLoop(timestamp, game));
  }, remainingDelay);
};

function handleStartTimer(game: Game) {
  if (game.startTimer > 0) {
    var timer = setInterval(() => {
      game.startTimer -= 1;
      if (game.startTimer === 0) {
        game.running = true;
      }
      if (game.startTimer === 0) {
        clearInterval(timer);
      }
    }, 1000);
  }
}
