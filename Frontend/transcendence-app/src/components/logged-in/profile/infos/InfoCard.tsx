"use client";

import { useState } from "react";
import Profile from "@/services/Profile.service";
import NavbarProfilInfo from "./NavbarProfilInfo";


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
				return <div>contenu overview</div>
			case 1:
				return <div>contenu section2</div>
			case 2:
				return <div>contenu section3</div>
			case 3:
				return <div>contenu section4</div>
			default:
				return <div>contenu overview</div>
        	}
      	})()}
	</div>
  )
}
