"use client";

// Import les composants react
import { useEffect, useState } from "react";

// Import du style
import styles from "@/styles/lobby/training/Training.module.css";

// Import des composants
import InTraining from "./InTraining";
import StoryTraining from "./Story/Story";

// Other imports
import TrainingService from "@/services/Training.service";
import Practice from "./Practice/Practice";

type Props = {
  profile: Profile;
};

export default function Training({ profile }: Props) {
  const trainingService = new TrainingService();
  const [trainingId, setTrainingId] = useState<string>("");

  useEffect(() => {
    trainingService.isInTraining().then((ret) => {
      setTrainingId(ret.data);
    });
  }, []);

  // -----------------------------------  TRAINING  ----------------------------------- //

  return (
    <div className={styles.training}>
      <InTraining
        trainingService={trainingService}
        trainingId={trainingId}
        setTrainingId={setTrainingId}
      />
      <StoryTraining profile={profile} trainingService={trainingService} />
      <Practice profile={profile} />
    </div>
  );
}
