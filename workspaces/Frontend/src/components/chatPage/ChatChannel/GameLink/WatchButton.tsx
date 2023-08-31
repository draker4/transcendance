import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LobbyService from "@/services/Lobby.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";

type Props = {
  userId: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export default function WatchButton({ userId, setLoading }: Props) {
  const router = useRouter();
  const lobbyService = new LobbyService();
  const [gameId, setGameId] = useState<string>("");

  function watchGame() {
    if (!gameId) return;
    setLoading(true);
    const url = "/home/game/" + gameId;
    router.push(url);
  }

  useEffect(() => {
    lobbyService.otherInGame(userId).then((ret) => {
      setGameId(ret.data);
    });

  }, []);

  return (
    <Tooltip title={"watch game"} arrow placement="top">
      <FontAwesomeIcon icon={faEye} onClick={watchGame} style={{
          cursor: "pointer"
        }}
      />
    </Tooltip>
  );
}
