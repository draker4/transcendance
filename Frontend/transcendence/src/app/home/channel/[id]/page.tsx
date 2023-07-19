import ChannelMainFrame from "@/components/channel/ChannelMainFrame";
import { Refresher } from "@/components/refresher/Refresher";
import styles from "@/styles/profile/Profile.module.css";

type Params = {
	params: {
	  id: number;
	};
};

export default function ChannelprofilePage({ params: { id } }: Params) {

	// [+] Recup l'info du statut user par rapport a channel
	// joined | banned | invited | operator etc... a determiner

	// [+] Recup la channel elle meme, avec dependances des users



  return (
	<div className={styles.main}>
		<Refresher />
		<ChannelMainFrame />
	</div>
  )
}
