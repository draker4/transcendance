import React from 'react'
import styles from "@/styles/profile/Profile.module.css";
import ChannelFirstPart from './ChannelFirstPart';
import ChannelSecondPart from './ChannelSecondPart';

export default function ChannelMainFrame() {
  return (
	<div className={styles.profileMainFrame}>
		<ChannelFirstPart />
		<ChannelSecondPart />
	</div>
  );
}
