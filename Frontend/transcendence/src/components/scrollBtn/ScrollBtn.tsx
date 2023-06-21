"use client";
// import { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import styles from "@/styles/scrollBtn/ScrollBtn.module.css";

const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

function scrollToTop() {
  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const ScrollBtn = () => {
  // const [showBtn, setShowBtn] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log("scroll module loaded");
  //   const handleScrollBtn = () => {
  //     console.log("scroll btn");
  //     if (window.scrollY > 100) {
  //       setShowBtn(true);
  //     } else {
  //       setShowBtn(false);
  //     }
  //   };

  //   // Check if running on the client-side before adding the event listener
  //   if (typeof window !== "undefined") {
  //     window.addEventListener("scroll", handleScrollBtn);
  //   }

  //   return () => {
  //     if (typeof window !== "undefined") {
  //       window.removeEventListener("scroll", handleScrollBtn);
  //     }
  //   };
  // }, []);

  // const handleScrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <div className={styles.scroll}>
      <button className={styles.scrollBtn} onClick={scrollToTop}>
        <MdKeyboardArrowUp />
      </button>
    </div>
  );
};

export default ScrollBtn;
