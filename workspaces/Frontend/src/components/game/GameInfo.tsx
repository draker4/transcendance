import {
  GameData,
  Score,
  Round,
  Timer,
  Ball,
  BallDynamic,
  Player,
  PlayerDynamic,
} from "@transcendence/shared/types/Game.types";

import styles from "@/styles/game/GameInfo.module.css";

function showPlayer(player: Player | null, status: string) {
  const nameStyle = {
    color: `rgb(${player?.color.r}, ${player?.color.g}, ${player?.color.b})`,
  };
  if (!player)
    return (
      <div>
        <h2>Searching Player</h2>
        <p></p>
      </div>
    );
  return (
    <div className={styles.showPlayer}>
      <h2 style={nameStyle}>{player.name}</h2>
      <p>Status: {status}</p>
    </div>
  );
}

function showScore(gameData: GameData) {
  function displayRound(round: Round, index: number) {
    return (
      <div key={index} className={styles.displayRound}>
        <p className={styles.round}>{`R${index + 1}`}</p>
        <p className={styles.score}>{`${round.left} / ${round.right}`}</p>
      </div>
    );
  }

  return (
    <div className={styles.showScore}>
      {/* Display the score for each round */}
      <div className={styles.fullScore}>
        {gameData.score.round
          .slice(0, gameData.maxRound)
          .map((round, index) => displayRound(round, index))}
      </div>
    </div>
  );
}

type Props = {
  gameData: GameData;
};

export default function GameInfo({ gameData }: Props) {
  if (!gameData) return <div>Game not found</div>;
  return (
    <div className={styles.gameInfo}>
      {/* LEFT PLAYER */}
      <div className={styles.player}>
        {showPlayer(gameData.playerLeft, gameData.playerLeftStatus)}
      </div>

      {/* GENERAL */}
      <div className={styles.general}>
        <h1>{gameData.name}</h1>
        <h3>{gameData.type}</h3>
        <p>{gameData.status}</p>
        {showScore(gameData)}
      </div>

      {/* RIGHT PLAYER */}
      <div className={styles.player}>
        {showPlayer(gameData.playerRight, gameData.playerRightStatus)}
      </div>
    </div>
  );
}
