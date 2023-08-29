"use client";

// Import les composants react
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import du style
import styles from "@/styles/lobby/training/practice/Practice.module.css";

// Import des composants
import StandardPractice from "./StandardPractice";
import CustomPractice from "./CustomPractice";
import GeneralSettings from "./GeneralSettings";

// Other imports
import { toast } from "react-toastify";
import {
  randomMaxPoint,
  randomMaxRound,
  confirmBackground,
  confirmBall,
} from "@/lib/game/random";
import TrainingService from "@/services/Training.service";

type Props = {
  profile: Profile;
};

export default function Practice({ profile }: Props) {
  const [selected, setSelected] = useState<
    "Classic" | "Best3" | "Best5" | "Random" | "Custom" | "Story"
  >("Classic");
  const [storyLevel, setStoryLevel] = useState<number>(0);
  const [maxPoint, setMaxPoint] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
  const [maxRound, setMaxRound] = useState<1 | 3 | 5 | 7 | 9>(3);
  const [side, setSide] = useState<"Left" | "Right">("Left");
  const [difficulty, setDifficulty] = useState<-2 | -1 | 0 | 1 | 2>(0);
  const [push, setPush] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("Classic");
  const [ball, setBall] = useState<string>("Classic");
  const router = useRouter();
  const trainingService = new TrainingService();

  // ----------------------------------  CREATE PONG  --------------------------------- //

  async function createPong() {
    const type = selected === "Random" ? "Custom" : selected;
    if (type !== "Story") {
      setStoryLevel(0);
    }
    const settings: CreateTrainingDTO = {
      name: `Training ${selected}`,
      type: type,
      storyLevel: storyLevel,
      player: profile.id,
      side: side,
      maxPoint: maxPoint,
      maxRound: maxRound,
      difficulty: difficulty,
      push: push,
      pause: pause,
      background: confirmBackground(background),
      ball: confirmBall(ball),
    };

    //Creer la game
    const res = await trainingService.createTraining(settings);
    await toast.promise(new Promise((resolve) => resolve(res)), {
      pending: "Creating training...",
      success: "Training created",
      error: "Error creating training",
    });
    if (!res.success) {
      console.log(res.message);
      return;
    }
    router.push("/home/training/" + res.data);
  }

  useEffect(() => {
    if (selected === "Classic") {
      setMaxPoint(9);
      setMaxRound(1);
      setPush(false);
      setPause(false);
      setBackground("Classic");
      setBall("Classic");
    } else if (selected === "Best3") {
      setMaxPoint(7);
      setMaxRound(3);
      setPush(true);
      setPause(true);
      setBackground("Earth");
      setBall("Classic");
    } else if (selected === "Best5") {
      setMaxPoint(5);
      setMaxRound(5);
      setPush(true);
      setPause(true);
      setBackground("Island");
      setBall("Classic");
    } else if (selected === "Random") {
      setMaxPoint(randomMaxPoint());
      setMaxRound(randomMaxRound());
      setPush(Math.random() < 0.5);
      setPause(Math.random() < 0.5);
      setBackground("Random");
      setBall("Random");
    }
  }, [selected]);

  // -----------------------------------  PRACTICE  ----------------------------------- //

  return (
    <div className={styles.practice}>
      <h2>Practice</h2>
      <StandardPractice selected={selected} setSelected={setSelected} />
      <CustomPractice
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
        background={background}
        setBackground={setBackground}
        ball={ball}
        setBall={setBall}
      />
      <GeneralSettings
        side={side}
        setSide={setSide}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <button className={styles.save} onClick={() => createPong()}>
        Play
      </button>
    </div>
  );
}
