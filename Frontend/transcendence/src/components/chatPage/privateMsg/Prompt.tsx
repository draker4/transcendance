import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

type Props = {
  pongie: Pongie;
};

export default function Prompt({ pongie }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    adjustHeight();
    if (text.length === 1 && text[0] === "\n") {
      setText("");
      setIsEmpty(true);
      if (textareaRef.current) textareaRef.current.style.height = "40px";
    }
  }, [text]);

  const placeholder = "Send a message at " + pongie.login;
  const buttonAddedClass = isEmpty
    ? styles.disabledButton
    : styles.activeButton;

  const handleSendMsg = (e: React.FormEvent | null) => {
    e?.preventDefault();

    console.log("Message to send :", text);
    setText("");
    setIsEmpty(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsEmpty(e.target.value === "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMsg(null);
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        600
      )}px`;
    }
  };

  return (
    <div className={styles.prompt}>
      <form onSubmit={handleSendMsg}>
        <textarea
          name="prompt"
          ref={textareaRef}
          placeholder={placeholder}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          value={text}
          maxLength={350}
        />
        <button
          className={`${styles.paperPlane} ${buttonAddedClass}`}
          type="submit"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}
