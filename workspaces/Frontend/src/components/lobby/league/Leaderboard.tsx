import AvatarUser from "@/components/avatarUser/AvatarUser";
import styles from "@/styles/lobby/league/Leaderboard.module.css";
import Image from "next/image";
import Link from "next/link";

type Props = {
  json: PlayerLeaderBoard[];
};

export default function Leaderboard({ json }: Props) {
  if (json === undefined || json === null || json.length === 0) {
    return (
      <div className={styles.leaderboard}>
        <h1>Ranking</h1>
        <p className={styles.loading}>Recherche en cours...</p>
      </div>
    );
  } else {
    //console.log("LEADERBOARD FETCHING => json = ", json);
  }

  return (
    <div className={styles.leaderboard}>
      <h1>Ranking</h1>

      <div className={styles.podium}>
        <div className={styles.second}>
          <div className={styles.pad}>
            <p>2</p>
          </div>
          {json.length > 1 && json[1] && (
            <div className={styles.podAvatarlogin}>
              <div className={styles.podAvatar}>
                <AvatarUser
                  avatar={json[1].user.avatar}
                  borderSize={""}
                  backgroundColor={json[1].user.avatar.backgroundColor}
                  borderColor={json[1].user.avatar.borderColor}
                  fontSize={""}
                />
              </div>
              <p>{json[1].login}</p>
            </div>
          )}
        </div>
        <div className={styles.first}>
          <div className={styles.pad}>
            <p>1</p>
          </div>
          {json.length > 0 && json[0] && (
            <div className={styles.podAvatarlogin}>
              <div className={styles.podAvatar}>
                <AvatarUser
                  avatar={json[0].user.avatar}
                  borderSize={""}
                  backgroundColor={json[0].user.avatar.backgroundColor}
                  borderColor={json[0].user.avatar.borderColor}
                  fontSize={""}
                />
              </div>
              <p>{json[0].login}</p>
            </div>
          )}
        </div>
        <div className={styles.third}>
          <div className={styles.pad}>
            <p>3</p>
          </div>
          {json.length > 2 && json[2] && (
            <div className={styles.podAvatarlogin}>
              <div className={styles.podAvatar}>
                <AvatarUser
                  avatar={json[2].user.avatar}
                  borderSize={""}
                  backgroundColor={json[2].user.avatar.backgroundColor}
                  borderColor={json[2].user.avatar.borderColor}
                  fontSize={""}
                />
              </div>
              <p>{json[0].login}</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.playerlist}>
        <div className={styles.header}>
          <div className={styles.avatar_box}>
            <p>Login</p>
          </div>
          <p style={{ textAlign: "center" }}>Score</p>
          <p style={{ textAlign: "center" }}>Rank</p>
        </div>
        {json.length > 0 &&
          json.map((player: any, index: number) => (
            <Link
              className={styles.links}
              href={`/home/profile/${player.id}`}
              key={index}
            >
              <div className={styles.player} key={index}>
                <div className={styles.avatar_box} style={{ height: "100%" }}>
                  <div style={{ width: "50px", height: "50px" }}>
                    <AvatarUser
                      avatar={player.user.avatar}
                      borderSize={""}
                      backgroundColor={player.user.avatar.backgroundColor}
                      borderColor={player.user.avatar.borderColor}
                      fontSize={""}
                    />
                  </div>
                  <p>{player.login}</p>
                </div>
                <p style={{ textAlign: "center" }}>{player.score}</p>
                <p style={{ textAlign: "center" }}>{player.rank}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
