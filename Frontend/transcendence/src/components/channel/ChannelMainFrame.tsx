import React from 'react'
import styles from "@/styles/profile/Profile.module.css";
import ChannelFirstPart from './ChannelFirstPart';
import ChannelSecondPart from './ChannelSecondPart';

type Props = {
	userStatus: UserStatusInChannel;
	avatar: Avatar;
	channel: Channel;
  };

export default function ChannelMainFrame({avatar, userStatus, channel}:Props) {



  return (
	<div className={styles.profileMainFrame}>
		<ChannelFirstPart avatar={avatar} userStatus={userStatus}/>
		<ChannelSecondPart />
	</div>
  );
}
