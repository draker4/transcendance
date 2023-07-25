import styles from "@/styles/profile/InfoCard.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faFaceSmileWink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
	relation: UserRelation;
	myRelation: UserRelation;
}

type ButtonData = {
	id: number;
	name: string;
	icon: IconProp;
	onClick: () => void;
  };



export default function ChanOpControlPannel({relation, myRelation}:Props) {
	
	const handleChanOp = () => {
	  if (relation.isChanOp) {
		  console.log(`[+] removing chanOp to user ${relation.user.login}`)
	  } else {
		  console.log(`[+] giving chanOp to user ${relation.user.login}`)
	  }
	};

  const buttonData : ButtonData[] = [
	{id: 0, name: "chanOp", icon:faFaceSmileWink, onClick: handleChanOp},
  ];




  return (
	<div className={styles.controlPannel} >
		{/* {buttonData.map((button) => {
			<div key={button.id}>
				<FontAwesomeIcon icon={button.icon} />
			</div>
		})} */}

{buttonData.map((button) => (
          <FontAwesomeIcon key={button.id} onClick={button.onClick} icon={button.icon} />
      ))}

		
	</div>
  );

}
