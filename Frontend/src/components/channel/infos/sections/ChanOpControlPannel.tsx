import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import styles from "@/styles/profile/InfoCard.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCertificate, faSkull, faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type Props = {
	relation: UserRelation;
	myRelation: UserRelation;
	role: ChannelRoles;
}

export enum RolesIcons {
    giveRmChanOp = "faCertificate",
	cancelInvite = "faSkull",
    giveRmBan = "faRectangleXmark",
}

type ButtonData = {
	id: number;
	name: string;
	icon: IconProp;
	onClick: () => void;
  };


export default function ChanOpControlPannel({relation, myRelation, role}:Props) {
	


	/* 
	
	switch(role) {
		case (ChannelRoles.operator):
			return ()
	}

	
	*/


	// [?]
	const [isChanOp, setIsChanOp] = useState(relation.isChanOp);


	// [+] remplacer par un go-validation-msg
	const handleChanOp = () => {
	  if (relation.isChanOp) {
		  console.log(`[+] removing chanOp to user ${relation.user.login}`)
	  } else {
		  console.log(`[+] giving chanOp to user ${relation.user.login}`)
	  }
	};

	const handleAskConfirmation = () => {
		return ;
	}


	// [+] switch en fonction du role 
  const buttonData : ButtonData[] = 
	// switch(role) {}
  [
	{id: 0, name: "chanOp", icon:faCertificate, onClick: handleAskConfirmation},

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
