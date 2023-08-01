import styles from "@/styles/profile/InfoCard.module.css";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  handleValidate: () => void;
  handleCancel: () => void;
  confirmationList: ConfirmationList;
  relation: UserRelation;
};

// [+] si besoin gerer dans un fichier a part
enum confSentences {
    giveChanOp = "Give chanOp ?",
    rmChanOp = "Remove chanOp ?",
}

export default function ConfirmationPannel({
  handleValidate,
  handleCancel,
  confirmationList,
  relation,
}: Props) {


 const makeConf = ():string => {
	switch(confirmationList) {
		case "chanOp":
		return relation.isChanOp ? confSentences.rmChanOp : confSentences.giveChanOp;


		case "nothing":
		return "";

		default:
		return "";

	}
 }



  return <div className={styles.confirmationPannel}>
	<pre className={styles.vctext}>{makeConf()}</pre>
	<FontAwesomeIcon className={styles.vcbutton} onClick={handleCancel} icon={faXmark} style={{color : "var(--notif)"}} />
	<FontAwesomeIcon className={styles.vcbutton} onClick={handleValidate} icon={faCheck} style={{color : "var(--accent1)"}} />
	</div>;
}
