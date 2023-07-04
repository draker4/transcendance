import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


type Props = {
  pongie: Pongie;
};



export default function Prompt({ pongie }: Props) {

const placeholder = "send a message at " + pongie.login;

const handleSendMsg = (e: any) => {
  e.preventDefault();
  console.log("paper plane pushed !");
}


  return (
	<div className={styles.prompt}>
    <div className={styles.promptCard}>
      <form onSubmit={handleSendMsg}>
        <textarea name="prompt"
         placeholder={placeholder} />
         <button className={styles.paperPlane} type="submit">
         <FontAwesomeIcon icon={faPaperPlane} />
         </button>
      </form>
    </div>
  </div>
  )
}
