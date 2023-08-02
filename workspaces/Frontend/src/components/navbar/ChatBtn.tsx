import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar/Navbar.module.css";
import { Socket } from "socket.io-client";

export default function ChatBtn({ socket }: { socket: Socket | undefined }) {

  return <FontAwesomeIcon icon={faComments} className={styles.menu} />;
}
