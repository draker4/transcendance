import { LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from '@mui/material/styles';

type Props = {
  profile: Profile;
};

export default function HeaderAchievement() {

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
        <BorderLinearProgress variant="determinate" value={10/30 * 100} />
        <p>Total: {10} / {30} </p>
	</>
  )
}
