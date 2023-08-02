import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import { useEffect, useState } from "react";
import SearchBarPongies from "@/components/chatPage/searchBar/SearchBarPongies";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import { useRouter } from "next/navigation";
import ChatService from "@/services/Chat.service";

export default function SectionPongies() {

	const	[pongies, setPongies] = useState<Pongie[]>([]);
	const	[pongieSearched, setPongieSearched] = useState<Pongie>();
	const	router = useRouter();
	const	chatService = new ChatService();

	useEffect(() => {

		const	getPongies = (payload: Pongie[]) => {
			console.log(payload);
		}

		chatService.socket?.emit('getPongies', getPongies);

	}, [chatService.socket]);

	const	displayPongie = (display: Display) => {
		setPongieSearched(display);
	}

	const	openProfile = () => {
		if (pongieSearched) {
			router.push(`/home/profile/${pongieSearched.id}`);
		}
	}

	return (
		<div className={stylesInfoCard.sections}>
			<SearchBarPongies
				displayPongie={displayPongie}
				socket={chatService.socket}
			/>

			{
				pongieSearched &&
				<div className={styles.part}>
					<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
						Pongie searched
					</p>
					<div className={styles.pongieSearched}>
						<div className={styles.avatar} onClick={openProfile}>
							<AvatarUser
								avatar={pongieSearched.avatar}
								borderSize="3px"
								backgroundColor={pongieSearched.avatar.backgroundColor}
								borderColor={pongieSearched.avatar.borderColor}
							/>
						</div>
						<div className={styles.login} style={{color: pongieSearched.avatar.borderColor}}>
							{pongieSearched.login}
						</div>
						{/* <PongieFooter pongie={pongieSearched} 	 */}
					</div>
				</div>
			}

			<div className={styles.part}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					My Pongies
				</p>
			</div>
		</div>
	);
}


// demande d'ami
// supprimer ami
// blackList
// chat
