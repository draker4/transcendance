import styles from "@/styles/profile/Achievements/Achievements.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faArrowPointer, faCloudArrowUp, faDumbbell, faG, faGraduationCap, faPen, faPeopleGroup, faPoo, faQuestion, faRankingStar, faScroll, faShieldHalved, faVideo } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope, faHandPeace } from "@fortawesome/free-regular-svg-icons";
import { PongColors } from "@/lib/enums/PongColors.enum";
import { Badge, LinearProgress, linearProgressClasses, styled } from "@mui/material";
import { UserAchievement } from "@transcendence/shared/types/Achievement.types";
import StatsService from "@/services/Stats.service";
import { useEffect } from "react";

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
	// achievement.completed = false;

	let		icon: IconProp | undefined = iconMapping[achievement.icone];

	const	content: number | string = achievement.value
									? achievement.value === 1000
									? '1K'
									: achievement.value
									: 0;

	if (!icon)
		icon = faQuestion;

	let	color = "var(--accent1)";

	switch (achievement.type) {
		case "game":
			color = PongColors.fuschia;
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
		  backgroundColor: color,
		},
	}));

	const badgeStyle = {
		"& .MuiBadge-badge": {
			color: "var(--tertiary1)",
			backgroundColor: "var(--primary1)",
			border: `2px solid ${color}`,
			right: '-3px',
			top: '-3px',
		},
	};

	const	background = `linear-gradient(to bottom, ${color} 55%, var(--primary1) 45%)`;
	
	return (
		<>
			{/* icon */}
			<div className={styles.left} style={{
				background: background,
			}}>
				<div className={styles.circleAround}>
					<div className={styles.circleInside} style={{backgroundColor: color}}>
						<Badge badgeContent={content} overlap="circular" sx={badgeStyle} max={1000}>
							<FontAwesomeIcon
								icon={icon}
								color="var(--primary1)"
								className={styles.icon}
							/>
						</Badge>
					</div>
				</div>
			</div>
			
			{/* text part */}
			<div className={styles.middle}>
				
				{
					achievement.completed && !achievement.collected &&
					<div className={styles.collect}>
						<h3>Collect {achievement.xp}xp!</h3>
					</div>
				}
				{
					(!achievement.completed || (achievement.completed && achievement.collected)) &&
					<div></div>
				}
				<div>
					<h5 style={{color: color}}>{achievement.name}</h5>
					<div>{achievement.description}</div>
				</div>

			{/* load bar */}
			{
				!achievement.completed && achievement.value > 0 &&
				<div className={styles.bottom}>
					<BorderLinearProgress variant="determinate" value={10/30 * 100} />
				</div>
			}
			{
				(achievement.completed || achievement.value === 0) && <div></div>
			}
			</div>

			{/* xp */}
			<div className={styles.right}>
				{
					(!achievement.completed || (achievement.completed && achievement.collected)) &&
					<div className={styles.xp}>
						<pre>{achievement.xp}xp</pre>
					</div>
				}
			</div>
		</>
	)
}
