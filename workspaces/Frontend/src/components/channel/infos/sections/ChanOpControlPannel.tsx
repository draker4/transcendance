import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import Channel_Service from "@/services/Channel.service";
import styles from "@/styles/profile/InfoCard.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCertificate, faSkull, faHand, faHandPeace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ConfirmationPannel from "./ConfirmationPannel";

type Props = {
	channelId:number;
	relation: UserRelation;
	myRelation: UserRelation;
	role: ChannelRoles;
	lists:ChannelLists;
}

type ButtonData = {
	id: number;
	name: string;
	icon: IconProp;
	onClick: () => void;
	colorDep: boolean;
  };

export default function ChanOpControlPannel({channelId, relation, myRelation, role, lists}:Props) {

	const channelService = new Channel_Service();

	const [waitingConfirmation, setWaitingConfirmation] = useState<boolean>(false);
	const [confirmationList, setConfirmationList] = useState<ConfirmationList>("nothing");

	const handleChanOp = () => {
	  if (relation.isChanOp) {
		  console.log(`[+] removing chanOp to user ${relation.user.login}`); //checking
		  // [+] enclencher ici le chgt vers backend
		  const rep = channelService.editRelation(channelId, relation.userId, {isChanOp:false});

		 relation.isChanOp = false;
		 lists.setOperators((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));
		 lists.setPongers((prev: UserRelation[]) => [...prev, relation]);
		  
	  } else {
		  console.log(`[+] giving chanOp to user ${relation.user.login}`); //checking
		  // [+] enclencher ici le chgt vers backend
		  const rep = channelService.editRelation(channelId, relation.userId, {isChanOp:true});

		  relation.isChanOp = true;
		  lists.setOperators((prev: UserRelation[]) => [...prev, relation]);
		  lists.setPongers((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));

	  }
	};

	const handleKick = () => {
		if (relation.invited) {
			console.log(`[+] removing channel invite to user ${relation.user.login}`); //checking
			// [+] enclencher ici le chgt vers backend
			relation.invited = false;
			lists.setLeavers((prev: UserRelation[]) => [...prev, relation]);
			lists.setInvited((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));
		 }
		 if (relation.joined) {
			console.log(`[+] removing channel join (kicking) to user ${relation.user.login}`); //checking
			// [+] enclencher ici le chgt vers backend
			relation.joined = false;
			lists.setPongers((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));
			lists.setLeavers((prev: UserRelation[]) => [...prev, relation]);
		 }
	};

	const handleBan = () => {
		if (relation.isBanned) {
			console.log(`[+] Removing ban penalty to user ${relation.user.login}`); //checking
			// [+] enclencher ici le chgt vers backend
			relation.isBanned = false;
			lists.setBanned((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));
			lists.setPongers((prev: UserRelation[]) => [...prev, relation]);
		} else {
			console.log(`[+] Giving ban penalty to user ${relation.user.login}`); //checking
			// [+] enclencher ici le chgt vers backend
			relation.isBanned = true;
			lists.setBanned((prev: UserRelation[]) => [...prev, relation]);
			lists.setPongers((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));
		}
	};

	const handleInvite = () => {
		if (!relation.invited) {
			console.log(`[+] Sending invitation to user ${relation.user.login}`); //checking
			// [+] enclencher ici le chgt vers backend
			relation.invited = true;
			lists.setInvited((prev: UserRelation[]) => [...prev, relation]);
			lists.setLeavers((prev: UserRelation[]) => prev.filter((user:UserRelation) => user.userId !== relation.userId));
		}
	}

	const handleValidate = () => {
		if (confirmationList === "chanOp")
			handleChanOp();
		else if (confirmationList === "kick")
			handleKick();
		else if (confirmationList === "ban")
			handleBan();
		else if (confirmationList === "invite")
			handleInvite();
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

	const banConfirmation = () => {
		setConfirmationList("ban");
		setWaitingConfirmation(true);
	}

	const inviteConfirmation = () => {
		setConfirmationList("invite");
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
				{id: 1, name: "kick", icon:faHand, onClick: kickConfirmation, colorDep: true},
				{id: 2, name: "ban", icon:faSkull, onClick: banConfirmation, colorDep: !relation.isBanned},
			  ];

		case ChannelRoles.invited:
		return [
				{id: 0, name: "kick", icon:faHand, onClick: kickConfirmation, colorDep: true},
			]

		case ChannelRoles.banned:
		return [
				{id: 0, name: "ban", icon:faSkull, onClick: banConfirmation, colorDep: !relation.isBanned},
			]

		case ChannelRoles.leaver:
		return [
			{id: 0, name: "invite", icon:faHandPeace, onClick: inviteConfirmation, colorDep: relation.joined},
			{id: 1, name: "ban", icon:faSkull, onClick: banConfirmation, colorDep: !relation.isBanned},
		]

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

