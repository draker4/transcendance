"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/lobby/party/CreateParty.module.css";

import LobbyService from "@/services/Lobby.service";
import DefineType from "@/components/lobby/party/DefineType";
import DefineField from "@/components/lobby/party/DefineField";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  randomMaxPoint,
  randomMaxRound,
  confirmBackground,
  confirmBall,
} from "@/lib/game/random";
import GeneralSettings from "./GeneralSettings";
import DefineName from "./DefineName";

type Props = {
  lobbyService: LobbyService;
  userId: number;
};

export default function CreateParty({ lobbyService, userId }: Props) {
  // ------------------------------------  CREATE  ------------------------------------ //
  //Pong Settings
  const [name, setName] = useState<string>("");
  const [enterName, setEnterName] = useState<boolean>(false);
  const [maxPoint, setMaxPoint] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(9);
  const [maxRound, setMaxRound] = useState<1 | 3 | 5 | 7 | 9>(1);
  const [side, setSide] = useState<"Left" | "Right">("Left");
  const [push, setPush] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);
  const [speed, setSpeed] = useState<-2 | -1 | 0 | 1 | 2>(0);
  const [background, setBackground] = useState<string>("Classic");
  const [ball, setBall] = useState<string>("Classic");
  const [selected, setSelected] = useState<
    "Classic" | "Best3" | "Best5" | "Random" | "Custom"
  >("Classic");
  const [type, setType] = useState<
    "Classic" | "Best3" | "Best5" | "Custom" | "Story"
  >("Classic");
  const router = useRouter();

  async function createGame() {
    // if name is empty, show error message
    if (name.trim() === "") {
      setName("");
      setEnterName(true);
      return;
    }

    //Creer un objet avec les settings
    const settings: GameDTO = {
      name: name,
      type: type,
      mode: "Party",
      host: userId,
      opponent: -1,
      invite: -1,
      hostSide: side,
      maxPoint: maxPoint,
      maxRound: maxRound,
      difficulty: speed,
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

  useEffect(() => {
    if (selected === "Classic") {
      setMaxPoint(9);
      setMaxRound(1);
      setType("Classic");
      setPush(false);
      setPause(false);
      setBackground("Classic");
      setBall("Classic");
    } else if (selected === "Best3") {
      setMaxPoint(7);
      setMaxRound(3);
      setType("Best3");
      setPush(true);
      setPause(true);
      setBackground("Earth");
      setBall("Classic");
    } else if (selected === "Best5") {
      setMaxPoint(5);
      setMaxRound(5);
      setType("Best5");
      setPush(true);
      setPause(true);
      setBackground("Island");
      setBall("Classic");
    } else if (selected === "Random") {
      setMaxPoint(randomMaxPoint());
      setMaxRound(randomMaxRound());
      setType("Custom");
      setPush(Math.random() < 0.5);
      setPause(Math.random() < 0.5);
      setBackground("Random");
      setBall("Random");
    } else if (selected === "Custom") {
      setType("Custom");
    }
  }, [selected]);

  useEffect(() => {
    console.log("Difficulty: ", speed);
  }, [speed]);

  // -------------------------------------  RENDU  ------------------------------------ //
  return (
    <div className={styles.createParty}>
      <DefineName
        name={name}
        setName={setName}
        enterName={enterName}
        setEnterName={setEnterName}
      />

      <label className={styles.section}>Define Party Settings</label>
      <DefineType
        selected={selected}
        setSelected={setSelected}
        maxPoint={maxPoint}
        setMaxPoint={setMaxPoint}
        maxRound={maxRound}
        setMaxRound={setMaxRound}
        push={push}
        setPush={setPush}
        pause={pause}
        setPause={setPause}
      />
      <GeneralSettings
        side={side}
        setSide={setSide}
        speed={speed}
        setSpeed={setSpeed}
      />
      <label className={styles.section}>Define Party Field</label>
      <DefineField
        background={background}
        setBackground={setBackground}
        ball={ball}
        setBall={setBall}
        selected={selected}
      />
      <div className={styles.confirm}>
        <button className={styles.save} type="button" onClick={createGame}>
          Create Party
        </button>
      </div>
    </div>
  );
}
