import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LobbyService from "@/services/Lobby.service";

type Props = {
  userId: number;
};

export default function WatchButton({ userId }: Props) {
  const router = useRouter();
  const lobbyService = new LobbyService();
  const [gameId, setGameId] = useState<string>("");

  function watchGame() {
    if (!gameId) return;
    const url = "home/game/" + gameId;
    router.push(url);
  }

  useEffect(() => {
    const ret = lobbyService.otherInGame(userId).then((ret) => {
      setGameId(ret.data);
    });
  }, []);

  return (
    <button type="button" onClick={watchGame}>
      Join
    </button>
  );
}
