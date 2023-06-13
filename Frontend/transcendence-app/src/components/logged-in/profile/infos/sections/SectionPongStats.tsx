import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css";
import Item from "./Item";
import MottoDisplayOnly from "./motto2/MottoDisplayOnly";
import StoryDisplayOnly from "./story/StoryDisplayOnly";

type Props = {
  profile: Profile;
}


export default function SectionPongStats({profile} : Props) {

  const crunchyMotto: string = "Give me more paddles, im super-hungry !";
  // const crunchyMotto: string = "";

  const crunchyBio: string = "Hey there! I'm a passionate player of online CrunchyPong. I've spent countless hours honing my skills and mastering the nuances of this game. My ultimate goal is to become the greatest pong cruncher of all time!";
  // const crunchyBio: string = "";


return (
	<div className={styles.sections}>

	{/* MOTTO */}
	<MottoDisplayOnly profile={profile}/>

	{/* STORY */}
	<StoryDisplayOnly profile={profile}/>

	<Item title="Level">
		<p>item's content : customize it with a specific component</p>
	</Item>

	<Item title="Ranking">
		<p>item's content : customize it with a specific component</p>
	</Item>

	<Item title="Recent games">
		<p>item's content : customize it with a specific component</p>
	</Item>

	</div>
)
}
