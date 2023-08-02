import { useState } from "react";
import { GameData, Player } from "@transcendence/shared/types/Game.types";
import { Round } from "@transcendence/shared/types/Score.types";
import styles from "@/styles/game/Info.module.css";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import { PLAYER_COLOR } from "@transcendence/shared/constants/Asset.constants";
import { colorHexToRgb } from "@transcendence/shared/game/pongUtils";
import { addPlayerMessage } from "@/lib/game/gameLoop";

function showPlayer(
  player: Player | null,
  status: string,
  side: "Left" | "Right",
  setPlayer: Function
) {
  const nameStyle = {
    color: `rgb(${player?.color.r}, ${player?.color.g}, ${player?.color.b})`,
  };
  if (!player)
    return (
      <div className={side === "Left" ? styles.showLeft : styles.showRight}>
        <h2>Searching Player</h2>
        <p>Status: {status}</p>
      </div>
    );
  const avatar: Avatar = {
    image: player.avatar.image,
    variant: player.avatar.variant,
    borderColor: player.avatar.borderColor,
    backgroundColor: player.avatar.backgroundColor,
    text: player.avatar.text,
    empty: player.avatar.empty,
    isChannel: false,
    decrypt: player.avatar.decrypt,
  };

  function changePlayerColor(player: Player, setPlayer: Function) {
    // Get the next color
    const actualColor = player.avatar.borderColor;
    const index = PLAYER_COLOR.findIndex(
      (colorObj) => colorObj.color === actualColor
    );
    let nextIndex = index + 1;
    if (nextIndex >= PLAYER_COLOR.length) nextIndex = 0;
    const newHexColor = PLAYER_COLOR[nextIndex].color;
    const newRgbColor = colorHexToRgb(newHexColor);

    // Update the player's color and avatar's border color
    setPlayer((prevPlayer: Player) => {
      const newPlayer = { ...prevPlayer };
      newPlayer.color = newRgbColor;
      newPlayer.avatar.borderColor = newHexColor;
      addPlayerMessage(newPlayer);
      return newPlayer;
    });
  }

  return (
    <button
      className={side === "Left" ? styles.leftPlayer : styles.rightPlayer}
      onClick={() => changePlayerColor(player, setPlayer)}
    >
      <div className={styles.avatar}>
        <AvatarUser
          avatar={avatar}
          borderSize={"3px"}
          backgroundColor={avatar.backgroundColor}
          borderColor={avatar.borderColor}
        />
      </div>
      <h2 style={nameStyle}>{player.name}</h2>
    </button>
  );
}

function showScore(gameData: GameData) {
  function displayRound(round: Round, index: number) {
    // Determine the className based on the comparison with currentRound
    let roundClassName = styles.round;

    if (index < gameData.actualRound) {
      roundClassName = styles.roundFinished;
    } else if (index === gameData.actualRound) {
      roundClassName = styles.currentRound;
    } else if (index > gameData.actualRound) {
      roundClassName = styles.roundRemaining;
    }

    return (
      <div key={index} className={`${styles.displayRound} ${roundClassName}`}>
        <p className={styles.roundLabel}>{`R${index + 1}`}</p>
        <p className={styles.score}>{`${round.left} - ${round.right}`}</p>
      </div>
    );
  }

  return (
    <div className={styles.showScore}>
      {gameData.score.round
        .slice(0, gameData.maxRound)
        .map((round, index) => displayRound(round, index))}
    </div>
  );
}

type Props = {
  gameData: GameData;
};

export default function Info({ gameData }: Props) {
  const [leftPlayer, setLeftPlayer] = useState(gameData.playerLeft);
  const [rightPlayer, setRightPlayer] = useState(gameData.playerRight);

  if (!gameData) return <div>Game not found</div>;
  return (
    <div className={styles.info}>
      <div className={styles.general}>
        {/* LEFT PLAYER */}
        {showPlayer(
          leftPlayer,
          gameData.playerLeftStatus,
          "Left",
          setLeftPlayer
        )}

        {/* GENERAL */}
        <div className={styles.title}>
          <h2>{gameData.name}</h2>
          <p>{gameData.type}</p>
        </div>

        {/* RIGHT PLAYER */}
        {showPlayer(
          rightPlayer,
          gameData.playerRightStatus,
          "Right",
          setRightPlayer
        )}
      </div>
      {gameData.score && showScore(gameData)}
    </div>
  );
}
