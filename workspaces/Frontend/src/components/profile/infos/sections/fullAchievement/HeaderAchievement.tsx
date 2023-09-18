import { LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from '@mui/material/styles';
import { UserAchievement } from "@transcendence/shared/types/Achievement.types";

export default function HeaderAchievement({ achievements }: {
  achievements: UserAchievement[];
}) {

  const total: number = achievements.length;
  let   completed: number = 0;

  achievements.forEach(achievement => {
    if (achievement.completed)
      completed++;
  })

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    margin: "10px auto",
	  width: "70%",
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "var(--primary2)",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "var(--accent2)",
    },
  }));

  return (
	<>
		<h3>Achievements</h3>
    <BorderLinearProgress variant="determinate" value={completed/total * 100} />
    <p>Total: {completed} / {total} </p>
	</>
  )
}
