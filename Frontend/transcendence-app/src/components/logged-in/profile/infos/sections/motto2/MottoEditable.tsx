import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, useState } from "react";
import { checkMotto } from "@/lib/profile/edit/checkMotto";
import submitMotto from "@/lib/profile/edit/submitMotto";
import { getProfileByLogin } from "@/lib/profile/getProfileInfos";
import { filterBadWords } from "@/lib/bad-words/filterBadWords";

type Props = {
	profile: Profile;
	token: string;
  }

export default function mottoEditable({profile, token} : Props) {

	const [editMode, setEditMode] = useState<boolean>(false);
	const [motto, setMotto] = useState<string>(profile.motto === null ? "" : profile.motto);
	const [editedMotto, setEditedMotto] = useState<string>(motto);
	const [notif, setNotif] = useState<string>("");
	const [prof, setProf] = useState<Profile>(profile);

	const handleClickEdit = () => {
		setEditMode(true);
	}

	const handleEditedMottoChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEditedMotto(event.target.value);
	}

	const handleActionMotto = async (data: FormData) => {
		const submitedMotto = data.get('motto');


		if (typeof submitedMotto === 'string') {

			if (submitedMotto === motto) {
				setEditMode(false);
				return ;
			}

			const checkedMotto = checkMotto(submitedMotto);
			setNotif(checkedMotto);

			if (checkedMotto.length === 0) {
				const response = await submitMotto(submitedMotto, token);

				if (response === "") {
					const updatedProfile = profile;
					updatedProfile.motto = filterBadWords(submitedMotto);


					setProf(updatedProfile);
					setMotto(updatedProfile.motto);
					setEditMode(false);
				}
			}
		}
	}

	const handleStupidButton = async () => {
		const freshProfile = await getProfileByLogin(token, profile.login);
		console.log("freshProfile motto : ",freshProfile.motto);
	}

  return (
	<div>
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
					
					<button type="submit">confirm changes</button>
				</form>
			</div>
		}

		<br/>
		<br/>
		<button onClick={handleStupidButton}>stupid</button>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
	</div>
  )
}
