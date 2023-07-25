import {
  GameData,
  Score,
  Timer,
  Ball,
  BallDynamic,
  Player,
  PlayerDynamic,
  StatusMessage,
} from "@Shared/types/Game.types";

import { useEffect } from "react";
import { Socket } from "socket.io-client";

// Function to show PlayerDynamic data
function showPlayerDynamic(playerDynamic: PlayerDynamic, position: string) {
  return (
    <div>
      <h3>{position} Dynamic</h3>
      <p>PositionX: {playerDynamic.posX}</p>
      <p>PositionY: {playerDynamic.posY}</p>
      <p>Speed: {playerDynamic.speed}</p>
      <p>Move: {playerDynamic.move}</p>
      <p>Push: {playerDynamic.push}</p>
      <p>Status: {playerDynamic.status}</p>
    </div>
  );
}

function showPlayer(player: Player | null, position: string) {
  if (!player)
    return (
      <div>
        <h3>{position} Fixed</h3>
        <p>Player not defined</p>
      </div>
    );
  return (
    <div>
      <h3>{position} Fixed</h3>
      <p>Id: {player.id}</p>
      <p>Name: {player.name}</p>
      <p>Color: {JSON.stringify(player.color)}</p>
      <p>Side: {player.side}</p>
    </div>
  );
}

function showScore(score: Score | null) {
  if (!score) return <p>Score not defined</p>;
  return (
    <div>
      <h3>Score</h3>
      <p>Host Round Won: {score.hostRoundWon}</p>
      <p>Opponent Round Won: {score.opponentRoundWon}</p>
      {score.round.map((roundScore, index) => (
        <p key={index}>
          Round {index + 1}: Host {roundScore.host} - Opponent{" "}
          {roundScore.opponent}
        </p>
      ))}
    </div>
  );
}

function showTimer(timer: Timer | null) {
  if (!timer)
    return (
      <div>
        <h3>Timer</h3>
        <p>Timer not defined</p>
      </div>
    );

  function displayTime(time: Date): string {
    return time.toLocaleTimeString();
  }

  const startTime = timer.start ? new Date(timer.start) : null;
  const endTime = timer.end ? new Date(timer.end) : null;

  const secondsRemaining =
    endTime instanceof Date
      ? Math.floor((endTime.getTime() - Date.now()) / 1000)
      : 0;

  return (
    <div>
      <h3>Timer</h3>
      <p>Reason: {timer.reason}</p>
      <p>Start: {startTime ? displayTime(startTime) : "N/A"}</p>
      <p>End: {endTime ? displayTime(endTime) : "N/A"}</p>
      <p>Seconds Remaining: {secondsRemaining}</p>
    </div>
  );
}

function showBallDynamic(ballDynamic: BallDynamic) {
  return (
    <div>
      <h3>Ball Dynamic</h3>
      <p>PositionX: {ballDynamic.posX}</p>
      <p>PositionY: {ballDynamic.posY}</p>
      <p>Speed: {ballDynamic.speed}</p>
      <p>MoveX: {ballDynamic.moveX}</p>
      <p>MoveY: {ballDynamic.moveY}</p>
      <p>Push: {ballDynamic.push}</p>
    </div>
  );
}

function showBall(ball: Ball) {
  return (
    <div>
      <h3>Ball Fixed</h3>
      <p>Image: {ball.img}</p>
      <p>Color: {ball.color}</p>
    </div>
  );
}

type Props = {
  gameData: GameData;
};

export default function GameInfo({ gameData }: Props) {
  if (!gameData) return <div>Game not found</div>;
  return (
    <div>
      <h1>WIP Pong</h1>
      <p>Game ID: {gameData.id}</p>
      <p>Game Name: {gameData.name}</p>

      <h2>Game Ball</h2>
      {showBall(gameData.ball)}
      {showBallDynamic(gameData.ballDynamic)}

      <h2>Game Player</h2>
      {showPlayer(gameData.playerLeft, "Player Left")}
      {showPlayerDynamic(gameData.playerLeftDynamic, "Player Left")}
      {showPlayer(gameData.playerRight, "Player Right")}
      {showPlayerDynamic(gameData.playerRightDynamic, "Player Right")}

      <h2>Game Data</h2>
      <p>Background: {gameData.background}</p>
      <p>Type: {gameData.type}</p>
      <p>Mode: {gameData.mode}</p>
      <p>Difficulty: {gameData.difficulty}</p>
      <p>Push: {gameData.push}</p>
      <p>Font Color: {JSON.stringify(gameData.fontColor)}</p>
      <p>Round Color: {JSON.stringify(gameData.roundColor)}</p>
      <p>Round Win Color: {JSON.stringify(gameData.roundWinColor)}</p>
      <p>Player Serve: {gameData.playerServe}</p>
      <p>Actual Round: {gameData.actualRound}</p>
      <p>Max Point: {gameData.maxPoint}</p>
      <p>Max Round: {gameData.maxRound}</p>
      <p>Status: {gameData.status}</p>
      <p>Result: {gameData.result}</p>
      {showScore(gameData.score)}
      {showTimer(gameData.timer)}
    </div>
  );
}
