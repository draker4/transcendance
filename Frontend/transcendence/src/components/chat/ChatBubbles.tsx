"use client";

import styles from "@/styles/chat/ChatBubbles.module.css";
import { Avatar } from "@mui/material";

export default function ChatBubbles() {
  return (
    <div className={styles.chatBubbles}>
      <div className={styles.line}></div>

      <div className={styles.bubbles}>
        <div className={styles.bubbles}>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
          <Avatar className={styles.bubble} variant="rounded"></Avatar>
        </div>

        <div className={styles.middleLine}></div>

        <div className={styles.bubbles}>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}></Avatar>
          <Avatar className={styles.bubble}>0</Avatar>
          <Avatar className={styles.bubble}>A</Avatar>
        </div>
      </div>

      <div className={styles.bottom}></div>
    </div>
  );
}
