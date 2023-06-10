"use client";

import { useState } from "react";
import Profile from "@/services/Profile.service";
import NavbarProfilInfo from "./NavbarProfilInfo";
import SectionPongStats from "./sections/SectionPongStats";
import SectionCustom from "./sections/SectionCustom";
import styles from "@/styles/profile/InfoCard.module.css"


type Props = {
		profile: Profile;
	}


export default function InfoCard({profile} : Props) {

	const [activeButton, setActiveButton] = useState(0);

  return (
	<div>
		<NavbarProfilInfo activeButton={activeButton} setActiveButton={setActiveButton}/>
		{(() => {
        switch (activeButton) {
			case 0:
				return <SectionPongStats profile={profile}/>
			case 1:
				return <div className={styles.sections}>contenu section2 : Contacts</div>
			case 2:
				return <div className={styles.sections}>contenu section3 : Channels</div>
			case 3:
				return <SectionCustom profile={profile}/>
			default:
				return <SectionPongStats profile={profile}/>
        	}
      	})()}
	</div>
  )
}
