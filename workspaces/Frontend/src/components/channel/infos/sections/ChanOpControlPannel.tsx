import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import styles from "@/styles/profile/InfoCard.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCertificate, faSkull, faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ConfirmationPannel from "./ConfirmationPannel";

type Props = {
	relation: UserRelation;
	myRelation: UserRelation;
	role: ChannelRoles;
	lists:ChannelLists;
}

// export enum RolesIcons {
//     giveRmChanOp = "faCertificate",
// 	cancelInvite = "faSkull",
//     giveRmBan = "faRectangleXmark",
// }

type ButtonData = {
	id: number;
	name: string;
	icon: IconProp;
	onClick: () => void;
	colorDep: boolean;
  };

export default function ChanOpControlPannel({relation, myRelation, role, lists}:Props) {

	// const [myState, setMyState] = useState(() => {
	// 	const stored = localStorage.getItem('myState');
	// 	if (stored)
	// 		console.log("STORED = ", stored);
	// 	return stored ? JSON.parse(stored) : relation.isChanOp;
	// });

	// const [isChanOp, setIsChanOp] = useState<boolean>(relation.isChanOp);

	const [waitingConfirmation, setWaitingConfirmation] = useState<boolean>(false);
	const [confirmationList, setConfirmationList] = useState<ConfirmationList>("nothing");


	// [+] remplacer par un go-validation-msg
	const handleChanOp = () => {
	  if (relation.isChanOp) {
		  console.log(`[+] removing chanOp to user ${relation.user.login}`)
		  // [+] enclencher ici le chgt vers backend
		 // setPongies((prev) => prev - Pongie);
		 lists.setOperators((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));
		 relation.isChanOp = false;
		 lists.setPongers((prev: UserRelation[]) => [...prev, relation]);
		  
	  } else {
		  console.log(`[+] giving chanOp to user ${relation.user.login}`)
		  // [+] enclencher ici le chgt vers backend
		  lists.setOperators((prev: UserRelation[]) => [...prev, relation]);

		  relation.isChanOp = true;
		  lists.setPongers((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));

	  }
	};

	const handleKick = () => {
		// if (invited) {
			// console.log(`[+] removing chanOp to user ${relation.user.login}`)
			// [+] enclencher ici le chgt vers backend
			

		// }

		
	};

	const handleValidate = () => {
		if (confirmationList === "chanOp")
			handleChanOp();
		else if (confirmationList === "kick")
			handleKick();

		handleCancel();
	};

	const handleCancel = () => {
		setConfirmationList("nothing");
		setWaitingConfirmation(false);
	};

	const chanOpConfirmation = () => {
		setConfirmationList("chanOp");
		setWaitingConfirmation(true);
	}

	const kickConfirmation = () => {
		setConfirmationList("kick");
		setWaitingConfirmation(true);
	}


	// [+] switch en fonction du role 
  const buttonData : ButtonData[] = (() => {
	switch(role) {

		case ChannelRoles.operator:

			if (relation.userId !== myRelation.userId) {
				return [
				  {id: 0, name: "chanOp", icon:faCertificate, onClick: chanOpConfirmation, colorDep:relation.isChanOp},
				];
			} else return [];

		case ChannelRoles.ponger:
		return	[
				{id: 0, name: "chanOp", icon:faCertificate, onClick: chanOpConfirmation, colorDep:relation.isChanOp},
				{id: 1, name: "kick", icon:faRectangleXmark, onClick: kickConfirmation, colorDep: true},
				// ... 
			  ];
		default:
			return[];	  
	}
})();



  return (
	<div className={styles.controlPannel} >

{waitingConfirmation && <ConfirmationPannel handleValidate={handleValidate} handleCancel={handleCancel} confirmationList={confirmationList} relation={relation} />}

{!waitingConfirmation && buttonData.map((button) => (
          <FontAwesomeIcon className={styles.command} key={button.id} onClick={button.onClick} icon={button.icon} style={{color : button.colorDep ? "var(--notif)" : "var(--accent1)"}} />
      ))}

		
	</div>
  );
}

