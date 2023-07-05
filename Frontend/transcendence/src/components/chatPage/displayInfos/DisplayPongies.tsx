import { ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/displayInfos/DisplayInfos.module.css";
import React from "react";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import SearchBar from "../searchBar/SearchBar";

export default function DisplayInfos({
  icon,
  socket,
  openDisplay,
}: {
  icon: ReactNode;
  socket: Socket;
  openDisplay: (display: Display) => void;
}) {
  const [pongies, setPongies] = useState<Pongie[]>([]);
  const	[confirm, setConfirm] = useState<Pongie | null>(null);

  const	deleteItem = (pongie: Pongie, event: React.MouseEvent) => {
	event.stopPropagation();
	const updatedPongies = pongies.filter((item) => item !== pongie);
	setPongies(updatedPongies);
  }

  const	cancel = (event: React.MouseEvent) => {
	event.stopPropagation();
	setConfirm(null);
  }

  const	confirmDelete = (pongie: Pongie, event: React.MouseEvent) => {
	event.stopPropagation();
	setConfirm(pongie);
  }

  const pongiesList = pongies.map((pongie) => {
		return (
			<React.Fragment key={pongie.id}>
				<div
					className={styles.list}
					onClick={() => openDisplay(pongie)}
				>
					<div className={styles.flex}>
						<div className={styles.avatar}>
							<AvatarUser
								avatar={pongie.avatar}
								borderSize="2px"
								borderColor={pongie.avatar.borderColor}
								backgroundColor={pongie.avatar.backgroundColor}
							/>
						</div>
						<div className={styles.name}>
							{pongie.login}
						</div>
						<div className={styles.delete}>
							<FontAwesomeIcon
								icon={faTrashCan}
								onClick={(event) => confirmDelete(pongie, event)}
							/>
						</div>
					</div>

					{
						confirm === pongie && 
						<div className={styles.confirm}>
							<p>Are you sure?</p>
							<button onClick={(event) => deleteItem(pongie, event)}>Yes</button>
							<button onClick={(event) => cancel(event)}>No</button>
						</div>
  					}

				</div>
			</React.Fragment>
		);
	});
	
	useEffect(() => {
		socket.emit("getPongies", (pongies: Pongie []) => {
			setPongies(pongies);
		});
	}, [socket]);

	return (
		<>
			<div className={styles.header}>
				{icon}
				<h3>My Pongies!</h3>
				<div></div>
			</div>
			<div className={styles.main}>
				<div className={styles.search}>
					<SearchBar
						socket={socket}
						search="myPongies"
						openDisplay={openDisplay}
					/>
				</div>
				{pongiesList}
			</div>
		</>
	);
}
