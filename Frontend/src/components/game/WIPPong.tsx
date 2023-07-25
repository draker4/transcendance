import { GameData, Player, Score, Timer, Ball } from "@Shared/types/Game.types";

type Props = {
  gameData: GameData;
};

function showPlayer(player: Player | null, position: string) {
  if (!player)
    return (
      <div>
        <h3>{position}</h3>
        <p>Player not defined</p>
      </div>
    );
  return (
    <div>
      <h3>{position}</h3>
      <p>Id: {player.id}</p>
      <p>Name: {player.name}</p>
      <p>Color: {player.color}</p>
      <p>Side: {player.side}</p>
      <p>PositionX: {player.posX}</p>
      <p>PositionY: {player.posY}</p>
      <p>Speed: {player.speed}</p>
      <p>Move: {player.move}</p>
      <p>Push: {player.push}</p>
      <p>Status: {player.status}</p>
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
  if (!timer) return <p>Timer not defined</p>;
  return (
    <div>
      <h3>Timer</h3>
      <p>Reason: {timer.reason}</p>
      <p>Time: {timer.time}</p>
    </div>
  );
}

function showBall(ball: Ball) {
  return (
    <div>
      <h2>Game Ball</h2>
      <p>Image: {ball.img}</p>
      <p>Color: {ball.color}</p>
      <p>PositionX: {ball.posX}</p>
      <p>PositionY: {ball.posY}</p>
      <p>Speed: {ball.speed}</p>
      <p>MoveX: {ball.moveX}</p>
      <p>MoveY: {ball.moveY}</p>
      <p>Push: {ball.push}</p>
    </div>
  );
}

export default function WIPPong({ gameData }: Props) {
  if (!gameData) return <div>Game not found</div>;
  return (
    <div>
      <h1>WIP Pong</h1>
      <p>Game ID: {gameData.id}</p>
      <p>Game Name: {gameData.name}</p>

      {showBall(gameData.ball)}
      <h2>Game Player</h2>
      {showPlayer(gameData.playerLeft, "Player Left")}
      {showPlayer(gameData.playerRight, "Player Right")}

      <h2>Game Data</h2>
      <p>Background: {gameData.background}</p>
      <p>Type: {gameData.type}</p>
      <p>Mode: {gameData.mode}</p>
      <p>Difficulty: {gameData.difficulty}</p>
      <p>Push: {gameData.push}</p>
      <p>Font Color: {JSON.stringify(gameData.fontColor)}</p>
      <p>Round Color: {JSON.stringify(gameData.roundColor)}</p>
      <p>Round Win Color: {JSON.stringify(gameData.roundWinColor)}</p>

      <h2>Dynamic Data</h2>
      <p>Player Serve: {gameData.playerServe}</p>
      <p>Actual Round: {gameData.actualRound}</p>
      <p>Max Point: {gameData.maxPoint}</p>
      <p>Max Round: {gameData.maxRound}</p>
      {showScore(gameData.score)}
      {showTimer(gameData.timer)}
      <p>Status: {gameData.status}</p>
      <p>Result: {gameData.result}</p>
    </div>
  );
}
