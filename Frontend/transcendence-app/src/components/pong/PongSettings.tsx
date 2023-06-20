import { useState, useEffect } from "react";
import styles from "@/styles/pong/PongSettings.module.css";
import Selector from "./Selector";
import SideSelector from "./SideSelector";
import Slider from "./Slider";

type Props = {
  pong: Pong;
  setSettings: Function;
  setPong: Function;
};

export default function PongSettings({ pong, setSettings, setPong }: Props) {
  const [ai, setAi] = useState<boolean>(pong.AI);
  const [push, setPush] = useState<boolean>(pong.push);
  const [score, setScore] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(pong.score);
  const [round, setRound] = useState<1 | 3 | 5 | 7 | 9>(pong.round);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(
    pong.difficulty
  );
  const [side, setSide] = useState<"left" | "right">(pong.side);
  const [saveButton, setSaveButton] = useState<string>("Save");

  useEffect(() => {
    setAi(pong.AI);
    setPush(pong.push);
    setSide(pong.side);
  }, [pong.AI, pong.push, pong.side]);

  const handleValidation = () => {
    const updatedPong: Pong = {
      AI: ai,
      push: push,
      score: score,
      round: round,
      difficulty: difficulty,
      side: side,
    };
    setSaveButton("Go");
    setTimeout(() => {
      setPong(updatedPong);
      setSettings(true);
    }, 300);
  };

  return (
    <div className={styles.settings}>
      <form>
        <label htmlFor="AI">AI</label>
        <Selector id="AI" value={ai} setValue={setAi} />
        <label htmlFor="push">Push</label>
        <Selector id="push" value={push} setValue={setPush} />
        <label>Score</label>
        <Slider min={3} max={9} step={1} value={score} setValue={setScore} />
        <label>Round</label>
        <Slider min={1} max={9} step={2} value={round} setValue={setRound} />
        <label>Difficulty</label>
        <Slider
          min={1}
          max={5}
          step={1}
          value={difficulty}
          setValue={setDifficulty}
        />
        <label htmlFor="side">Side</label>
        <SideSelector id="side" value={side} setValue={setSide} />
        <button
          className={`${styles.save} ${saveButton === "Go" ? styles.Go : ""}`}
          type="button"
          onClick={handleValidation}
        >
          {saveButton}
        </button>
      </form>
    </div>
  );
}
