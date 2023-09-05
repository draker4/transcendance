import styles from "@/styles/profile/Achievements/Achievements.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faCloudArrowUp, faDumbbell, faG, faGraduationCap, faPen, faPeopleGroup, faPoo, faQuestion, faRankingStar, faScroll, faShieldHalved, faVideo } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faEnvelope, faHandPeace } from "@fortawesome/free-regular-svg-icons";
import { PongColors } from "@/lib/enums/PongColors.enum";
import { LinearProgress, linearProgressClasses, styled } from "@mui/material";
import { UserAchievement } from "@transcendence/shared/types/Achievement.types";

export default function AchievementItem({
	achievement,
}: {
	achievement: UserAchievement;
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

	// [!] test
	// achievement.completed = true;
	achievement.date = new Date();

	let		icon: IconProp | undefined = iconMapping[achievement.icone];
	const	date: string = achievement.date
						? achievement.date.toLocaleDateString()
						: "";

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
		height: 5,
		borderRadius: 5,
		margin: "5px auto",
		width: "80%",
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
				!achievement.completed && achievement.value > 0 &&
				<div className={styles.bottom}>
					<pre>{10} / {30} </pre>
					<BorderLinearProgress variant="determinate" value={10/30 * 100} />
				</div>
			}

			{/* date */}
			{
				achievement.completed &&
				<div className={styles.bottom}>
					<div className={styles.icon}>
						<FontAwesomeIcon icon={faCheckCircle} className={styles.check} />
						<div className={styles.achieved}>
							<h5>Achieved!</h5>
							<pre>{date}</pre>
						</div>
					</div>
				</div>
			}

			</div>

			{/* xp */}
			<div className={styles.right}>
				<div className={styles.xp}>
					<pre>{achievement.xp}</pre>
					<pre>xp</pre>
				</div>
			</div>
		</>
	)
}
