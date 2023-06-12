import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, useState } from "react";
import { checkMotto } from "@/lib/profile/edit/checkMotto";
import submitMotto from "@/lib/profile/edit/submitMotto";

type Props = {
	profile: Profile;
	token: string;
  }


export default function SectionCustom({profile, token} : Props) {

	const [editMode, setEditMode] = useState<boolean>(false);
	const [motto, setMotto] = useState<string>("");
	const [editedMotto, setEditedMotto] = useState<string>(motto);

	const [notif, setNotif] = useState<string>("");



	// const crunchyMotto: string = "Give me more paddles, im super-hungry !"


	const handleClickEdit = () => {
		setEditMode(true);
	}

	const handleEditedMottoChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEditedMotto(event.target.value);
	}

	/* version NextJS */
	const handleActionMotto = async (data: FormData) => {
		const submitedMotto = data.get('motto');
		console.log('submitted motto : "' + submitedMotto + '"');

		if (typeof submitedMotto === 'string') {
			const checkedMotto = checkMotto(submitedMotto);
			setNotif(checkedMotto);

			if (checkedMotto.length == 0) {
				setMotto(submitedMotto);

				const response = await submitMotto(submitedMotto, token);

				// ici envoie vers le back et retour reponse

				setEditMode(false);
			}
		}

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
				<form action={handleActionMotto}>
					<p className={styles.motto}>
					{' '}
					<input type='text' 
						   name='motto' 
						   value={editedMotto} 
						   placeholder='set here your crunchy motto'
						   onChange={handleEditedMottoChange}
						   autoFocus
						   id='mottoInput'/>
					</p>
					<div className={styles.notif}>{notif}</div>
					
					<br/>
					<br/>
					<button type="submit">confirm changes</button>
				</form>
			</div>
		}


	</div>

	)
}