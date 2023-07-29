import {
  GameData,
  Round,
  Player,
} from "@transcendence/shared/types/Game.types";

import styles from "@/styles/gameSolo/InfoSolo.module.css";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import { CryptoService } from "@/services/crypto/Crypto.service";

import { useEffect } from "react";

const Crypto = new CryptoService();

async function showPlayer(
  player: Player | null,
  status: string,
  side: "Left" | "Right"
) {
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

  useEffect(() => {
    let isMounted = true;

    const loadAvatarImage = async () => {
      if (avatar?.decrypt && avatar?.image.length > 0) {
        avatar.image = await Crypto.decrypt(avatar.image);
        avatar.decrypt = false;
      }

      loadAvatarImage();

      return () => {
        isMounted = false;
      };
    };
  }, [avatar]);

  if (avatar?.decrypt && avatar?.image.length > 0) {
    avatar.image = await Crypto.decrypt(avatar.image);
    avatar.decrypt = false;
  }

  return (
    <div className={side === "Left" ? styles.showLeft : styles.showRight}>
      <div className={side === "Left" ? styles.leftPlayer : styles.rightPlayer}>
        <div className={styles.avatar}>
          <AvatarUser
            avatar={avatar}
            borderSize={"3px"}
            backgroundColor={avatar.backgroundColor}
            borderColor={avatar.borderColor}
          />
        </div>
        <h2 style={nameStyle}>{player.name}</h2>
      </div>
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
      {gameData.score.round
        .slice(0, gameData.maxRound)
        .map((round, index) => displayRound(round, index))}
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
      <div className={styles.general}>
        {/* LEFT PLAYER */}
        {showPlayer(gameData.playerLeft, gameData.playerLeftStatus, "Left")}

        {/* GENERAL */}
        <div className={styles.title}>
          <h1>{gameData.name}</h1>
          <h3>{gameData.type}</h3>
          <p>{gameData.status}</p>
        </div>

        {/* RIGHT PLAYER */}
        {showPlayer(gameData.playerRight, gameData.playerRightStatus, "Right")}
      </div>
      {showScore(gameData)}
    </div>
  );
}
