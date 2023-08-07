"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/lobby/party/CreateParty.module.css";

import LobbyService from "@/services/Lobby.service";
import DefineType from "@/components/lobby/party/DefineType";
import DefineField from "@/components/lobby/party/DefineField";
import DefineInvite from "@/components/lobby/party/DefineInvite";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { confirmBackground, confirmBall } from "@/lib/game/random";

type Props = {
  lobbyService: LobbyService;
  setCreateParty: Function;
  userId: number;
  createBtnRef: React.RefObject<HTMLButtonElement>;
};

export default function CreateParty({
  lobbyService,
  setCreateParty,
  userId,
  createBtnRef,
}: Props) {
  // ------------------------------------  CREATE  ------------------------------------ //
  //Pong Settings
  const [name, setName] = useState<string>("");
  const [enterName, setEnterName] = useState<boolean>(false); //Si le nom est vide, on affiche un message d'erreur
  const [maxPoint, setMaxPoint] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(9);
  const [maxRound, setMaxRound] = useState<1 | 3 | 5 | 7 | 9>(1);
  const [hostSide, setHostSide] = useState<"Left" | "Right">("Left");
  const [push, setPush] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("Classic");
  const [ball, setBall] = useState<string>("Classic");
  const [type, setType] = useState<"Classic" | "Best3" | "Best5" | "Custom">(
    "Classic"
  );
  const router = useRouter();
  const difficulty: 1 | 2 | 3 | 4 | 5 = 3;

  async function createGame() {
    // if name is empty, show error message
    if (name.trim() === "") {
      setName("");
      setEnterName(true);
      createBtnRef.current!.scrollIntoView({ behavior: "smooth" });
      return;
    }

    //Creer un objet avec les settings
    const settings: GameDTO = {
      name: name,
      type: type,
      mode: "Party",
      host: userId,
      opponent: -1,
      hostSide: hostSide,
      maxPoint: maxPoint,
      maxRound: maxRound,
      difficulty: difficulty,
      pause: pause,
      push: push,
      background: confirmBackground(background),
      ball: confirmBall(ball),
    };

    //Creer la game
    const res = await lobbyService.createGame(settings);
    await toast.promise(
      new Promise((resolve) => resolve(res)), // Resolve the Promise with 'res'
      {
        pending: "Creating game...",
        success: "Game created",
        error: "Error creating game",
      }
    );
    if (!res.success) {
      console.log(res.message);
      return;
    }
    router.push("/home/game/" + res.data);
  }

  const resetCreate = () => {
    setName("");
    setMaxPoint(9);
    setMaxRound(1);
    setHostSide("Left");
    setPush(false);
    setPause(false);
    setBackground("Classic");
    setBall("Classic");
    setType("Classic");
    setCreateParty(false);
  };

  // Function to reset Background and Ball when type changes to "Classic"
  useEffect(() => {
    if (type === "Classic") {
      setBackground("Classic");
      setBall("Classic");
    }
  }, [type]);

  // -------------------------------------  RENDU  ------------------------------------ //
  return (
    <div className={styles.createParty}>
      <div className={styles.name}>
        <label className={styles.section}>Party Name</label>
        <input
          className={enterName ? styles.nameInputError : styles.nameInput}
          type="text"
          placeholder={enterName ? "Please enter a name" : ""}
          id="name"
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setEnterName(false);
          }}
        />
      </div>

      <div className={styles.define}>
        <div className={styles.settings}>
          <label className={styles.section}>Define Party Settings</label>
          <DefineType
            maxPoint={maxPoint}
            setMaxPoint={setMaxPoint}
            maxRound={maxRound}
            setMaxRound={setMaxRound}
            type={type}
            setType={setType}
            hostSide={hostSide}
            setHostSide={setHostSide}
            push={push}
            setPush={setPush}
            pause={pause}
            setPause={setPause}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.section}>Define Party Field</label>
          <DefineField
            background={background}
            setBackground={setBackground}
            ball={ball}
            setBall={setBall}
            type={type}
          />
        </div>
      </div>
      <div className={styles.invite}>
        <label className={styles.section}>Invite</label>
        <DefineInvite />
      </div>
      <div className={styles.confirm}>
        <button className={styles.save} type="button" onClick={createGame}>
          Create Game
        </button>
        <button className={styles.cancel} type="button" onClick={resetCreate}>
          Cancel
        </button>
      </div>
    </div>
  );
}