import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LobbyService from "@/services/Lobby.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv } from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css";
import { toast } from "react-toastify";

type Props = {
  myself: User;
  inviterId: number;
};

export default function JoinButton({ myself, inviterId }: Props) {
  const router = useRouter();
  const lobbyService = new LobbyService();
  const [gameId, setGameId] = useState<string>("");

  async function joinGame() {
    if (!gameId) return;
    const res: ReturnData = await lobbyService.joinGame(gameId);
    await toast.promise(new Promise((resolve) => resolve(res)), {
      pending: "Joing game...",
      success: "Good Luck !",
      error: "Error joining game",
    });
    if (!res.success) {
      console.log(res.message);
      console.log(res.error);
      return;
    }
    const url = "home/game/" + res.data;
    router.push(url);
  }

  useEffect(() => {
    console.log("ongoing invite");
    const ret = lobbyService.ongoingInvite(inviterId).then((ret) => {
      if (ret.success) {
        setGameId(ret.data);
      }
    });
  }, []);

  if (!gameId) return null;

  return (
    <button onClick={joinGame} type="button">
      Join
    </button>
  );
}
