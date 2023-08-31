"use client";

// Import les composants react
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import du style
import styles from "@/styles/lobby/training/story/Story.module.css";

// Other imports
import { toast } from "react-toastify";
import { UserStory } from "@transcendence/shared/types/Story.types";
import StoryService from "@/services/Story.service";
import TrainingService from "@/services/Training.service";
import { confirmBackground, confirmBall } from "@/lib/game/random";
import StorySelector from "./StorySelector";
import { CircularProgress } from "@mui/material";
import { set } from "react-hook-form";

type Props = {
  profile: Profile;
  trainingService: TrainingService;
};

export default function Story({ profile, trainingService }: Props) {
  const storyService = new StoryService();
  const [loading, setLoading] = useState<boolean>(false);
  const [stories, setStories] = useState<UserStory[]>([]);
  const router = useRouter();
  const [levelSelected, setLevelSelected] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [creatingStory, setCreatingStory] = useState<boolean>(false);

  async function createStory() {
    setCreatingStory(true);
    const settings: CreateTrainingDTO = {
      name: stories[levelSelected].name,
      type: "Story",
      storyLevel: levelSelected + 1,
      player: profile.id,
      side: "Left",
      maxPoint: stories[levelSelected].maxPoint,
      maxRound: stories[levelSelected].maxRound,
      difficulty: stories[levelSelected].difficulty,
      push: stories[levelSelected].push,
      pause: stories[levelSelected].pause,
      background: confirmBackground(stories[levelSelected].background),
      ball: confirmBall(stories[levelSelected].ball),
    };

    const res = await trainingService.createTraining(settings);
    await toast.promise(new Promise((resolve) => resolve(res)), {
      pending: "Creating training...",
      success: "Training created",
      error: "Error creating training",
    });
    if (!res.success) {
      console.log(res.message);
      setCreatingStory(false);
      return;
    }
    router.push("/home/training/" + res.data);
  }
  useEffect(() => {
    storyService.getUserStories(profile.id).then((ret) => {
      if (ret && ret.success) {
        setStories(ret.data);
        setLoading(true);
        let checkLevel: number = 0;
        while (ret.data[checkLevel].levelCompleted) {
          checkLevel++;
        }
        setCurrentLevel(checkLevel);
      } else if (ret) {
        console.log(ret.message);
      }
    });
  }, []);
  if (!loading) {
    return (
      <div className={styles.story}>
        <h2>Story</h2>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={styles.story}>
      <h2>Story</h2>
      <div className={styles.selector}>
        {stories.map((story) => (
          <StorySelector
            title={story.name}
            points={story.maxPoint}
            rounds={story.maxRound}
            img={story.background}
            level={story.level}
            levelSelected={levelSelected}
            setLevelSelected={setLevelSelected}
            currentLevel={currentLevel}
            key={story.level}
          />
        ))}
      </div>
      <button
        className={styles.save}
        onClick={createStory}
        disabled={creatingStory}
      >
        {!creatingStory && "Play"}
        {creatingStory && <CircularProgress />}
      </button>
    </div>
  );
}
