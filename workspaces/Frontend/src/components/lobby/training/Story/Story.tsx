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

type Props = {
  profile: Profile;
  trainingService: TrainingService;
};

export default function Story({ profile, trainingService }: Props) {
  const storyService = new StoryService();
  const [stories, setStories] = useState<UserStory[]>([]);
  const router = useRouter();
  const [levelSelected, setLevelSelected] = useState<number>(1);
  async function createPong() {
    const settings: CreateTrainingDTO = {
      name: stories[levelSelected].name,
      type: "Story",
      storyLevel: levelSelected,
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
    storyService.getUserStories(profile.id).then((ret) => {
      if (ret && ret.success) {
        setStories(ret.data);
      } else if (ret) {
        console.log(ret.message);
      }
    });
  }, []);
  return (
    <div className={styles.story}>
      <h2>Story</h2>
      <div className={styles.selector}>
        {/* Render details for each story */}
        {stories.map((story) => (
          <StorySelector
            title={story.name}
            points={story.maxPoint}
            rounds={story.maxRound}
            img={story.background}
            level={story.level}
            levelSelected={levelSelected}
            setLevelSelected={setLevelSelected}
          />
        ))}
      </div>
      <button className={styles.save} onClick={() => createPong()}>
        Play
      </button>
    </div>
  );
}
