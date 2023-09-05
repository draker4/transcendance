import { FullAchievement } from "@transcendence/shared/types/Achievement.types";
import styles from "@/styles/profile/Achievements/Achievements.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faCloudArrowUp, faDumbbell, faG, faGraduationCap, faPen, faPeopleGroup, faPoo, faQuestion, faRankingStar, faScroll, faShieldHalved, faVideo } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope, faHandPeace } from "@fortawesome/free-regular-svg-icons";
import { PongColors } from "@/lib/enums/PongColors.enum";
import { LinearProgress, linearProgressClasses, styled } from "@mui/material";

export default function AchievementItem({
	achievement,
}: {
	achievement: FullAchievement;
}) {
	// Define a mapping from achievement.icone to FontAwesome icons
	const iconMapping: { [key: string]: IconProp } = {
		"faHandPeace": faHandPeace,
		"faPoo": faPoo,
		"faRankingStar": faRankingStar,
		"faPeopleGroup": faPeopleGroup,
		"faDumbbell": faDumbbell,
		"faScroll": faScroll,
		"faVideo": faVideo,
		"faGoogle": faG,
		"faGraduationCap": faGraduationCap,
		"faEnvelope": faEnvelope,
		"faShieldHalved": faShieldHalved,
		"faCloudArrowUp": faCloudArrowUp,
	};

	let icon: IconProp | undefined = iconMapping[achievement.icone];

	if (!icon)
		icon = faQuestion;

	let	color = "var(--accent1)";

	switch (achievement.type) {
		case "game":
			color = PongColors.canaryYellow;
			break ;
		case "league":
			color = PongColors.tangerine;
			break ;
		case "party":
			color = PongColors.blue;
			break ;
		case "training":
			color = PongColors.mauve;
			break ;
		case "demo":
			color = PongColors.appleGreen;
			break ;
		case "account":
			color = PongColors.turquoise;
			break ;
		default:
			color = "var(--tertiary1)";
	}

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
			{/* icon */}
			<div className={styles.left}>
				<div className={styles.circle}>
					<FontAwesomeIcon
						icon={icon}
						color={color}
					/>
				</div>
			</div>
			
			{/* text part */}
			<div className={styles.middle}>
				<h5>{achievement.name}</h5>
				<div>{achievement.description}</div>

			{/* load bar */}
			{
				achievement.value && achievement.value !== 0 &&
				<BorderLinearProgress variant="determinate" value={10/30 * 100} />
			}
			</div>

			{/* xp */}
			<div className={styles.right}>
				{achievement.xp + ' xp'}
			</div>
		</>
	)
}
