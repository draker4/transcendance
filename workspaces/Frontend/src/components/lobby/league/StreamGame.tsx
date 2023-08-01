import LobbyService from "@/services/Lobby.service";
import styles from "@/styles/lobby/league/StreamGame.module.css";
import { useRouter } from "next/navigation";

type Props = {
  lobbyService: LobbyService;
  json: GameRanked[];
};

export default function StreamGame({ lobbyService, json }: Props) {
  const router = useRouter();
  return (
    <div className={styles.StreamGame}>
      <div className={styles.gamelist}>
        <h1>Game list</h1>
        {json.length === 0 && <p className={styles.loading}>Loading...</p>}
        {json.length > 0 &&
          json.map((game: any, index: number) => (
            <div className={styles.game} key={index}>
              <p>{game.id}</p>
              <p>{game.Name}</p>
              <p>{game.Host}</p>
              <p>{game.Opponent}</p>
              <p>{game.Viewers_List}</p>
              <p>{game.Score_Host}</p>
              <p>{game.Score_Opponent}</p>
              <p>{game.CreatedAt}</p>
              <p>{game.Mode}</p>
              <button
                className={styles.watchbutton}
                onClick={() => router.push("/home/game/" + game.id)}
              >
                Watch
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
