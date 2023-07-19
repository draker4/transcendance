import styles from "@/styles/channel/Channel.module.css"

type Params = {
	params: {
	  id: number;
	};
};

export default function ChannelprofilePage({ params: { id } }: Params) {
  return (
	<div className={styles.main}>
		<h1>ChannelprofilePage</h1>
		<p>channel id</p>
		<p>{id}</p>
	</div>
  )
}
