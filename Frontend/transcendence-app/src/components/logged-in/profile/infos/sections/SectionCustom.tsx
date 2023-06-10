import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, useState, useRef } from "react";

type Props = {
	profile: Profile;
  }


export default function SectionCustom({profile} : Props) {

	const [editMode, setEditMode] = useState(false);
	const [motto, setMotto] = useState("");
	const [editedMotto, setEditedMotto] = useState(motto);
	const mottoInput = useRef<HTMLInputElement | null>(null);;

	// const crunchyMotto: string = "Give me more paddles, im super-hungry !"
	// const crunchyMotto: string = "";


	const handleClickEdit = () => {
		const input = mottoInput.current;
		if (input) {
			console.log(input.id + ' focus() asked')
			input.focus()
		} else {
			console.log('catch focus failed')
		}

		setEditMode(true)
	}

	const handleEditedMottoChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEditedMotto(event.target.value);
	}

	const handleSubmitMotto = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault;
		setMotto(editedMotto);
		setEditMode(false);
	}


	return (

	<div className={styles.sections}>
		<p className={styles.tinyTitle}>Crunchy motto</p>
		
		{ !editMode && motto !== "" &&
			<div onClick={handleClickEdit}>
				<p className={styles.motto}> {motto} </p>
				<button onClick={handleClickEdit}>Edit</button>
			</div>
		}
		
		{ !editMode && motto === "" &&
			<div onClick={handleClickEdit}>
				<p className={styles.motto + ' ' + styles.placeholder}> set here your crunchy motto </p>
				<button onClick={handleClickEdit}>Edit</button>
			</div>
		}

		{ editMode &&
			<div>
				<form onSubmit={handleSubmitMotto}>
					<p className={styles.motto}>
					{' '}
					<input type="text" 
						   name="motto" 
						   value={editedMotto} 
						   placeholder="set here your crunchy motto"
						   onChange={handleEditedMottoChange}
						   ref={mottoInput}
						   id="mottoInput"/>
					{' '}
					</p>
					
					<br/>
					<br/>
					<button type="submit">confirm changes</button>
				</form>
			</div>
		}


	</div>

	)
}
