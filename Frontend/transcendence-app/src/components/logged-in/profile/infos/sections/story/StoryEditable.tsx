import { checkStory } from "@/lib/profile/edit/checkStory";
import submitStory from "@/lib/profile/edit/submitStory";
import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, useState } from "react";

type Props = {
	profile: Profile;
	token: string;
  }

export default function StoryEditable({profile, token} : Props) {
	const [editMode, setEditMode] = useState<boolean>(false);
	const [story, setStory] = useState<string>(profile.story === null ? "" : profile.story);
	const [editedStory, setEditedStory] = useState<string>(story);
	const [notif, setNotif] = useState<string>("");
	const [prof, setProf] = useState<Profile>(profile);

	const handleClickEdit = () => {
		setEditMode(true);
	}

	const handleEditedStoryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setEditedStory(event.target.value);
		event.target.style.height = 'auto';
		event.target.style.height = event.target.scrollHeight + 'px';
	}


	const handleActionStory = async (data: FormData) => {
		const submitedStory = data.get('story');

		if (typeof submitedStory === 'string') {

			if (submitedStory === story) {
				setEditMode(false);
				return ;
			}

			const checkedStory = checkStory(submitedStory);
			setNotif(checkedStory);

			if (checkedStory.length == 0) {
				const response = await submitStory(submitedStory, token);

				if (response === "") {
					const updatedProfile = profile;
					updatedProfile.story = submitedStory;

					setProf(updatedProfile);
					setStory(submitedStory);
					setEditMode(false);
				}
			}
		}
	}


  return (
	<div>
		<p className={styles.tinyTitle}>Crunchy story</p>
		
		{ !editMode && story !== "" &&
			<div className={styles.story + ' ' + styles.display} onClick={handleClickEdit}>
				<p className={styles.story}> {story} </p>
				<button onClick={handleClickEdit}>Edit</button>
			</div>
		}
		
		{ !editMode && story === "" &&
			<div onClick={handleClickEdit}>
				<p className={styles.story + ' ' + styles.placeholder}> set here your crunchy story </p>
				<button onClick={handleClickEdit}>Edit</button>
			</div>
		}

		{ editMode &&
			<div>
				<form action={handleActionStory}>
					<p className={styles.story}>
					
					<textarea 
						   name='story' 
						   value={editedStory} 
						   placeholder='set here your crunchy story'
						   onChange={handleEditedStoryChange}
						   autoFocus
						   rows={6}
						   maxLength={350}
						   spellCheck='false'
						   id='storyInput'/>
					</p>
					<div className={styles.notif}>{notif}</div>
					
					<button type="submit">confirm changes</button>
				</form>
			</div>
		}
	</div>
  )
}
