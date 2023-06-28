"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubbles from "./ChatBubbles";
import ChatMain from "./ChatMain";
import styles from "@/styles/chat/Chat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faComments } from "@fortawesome/free-solid-svg-icons";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Chat() {

  const [chatOpened, setChatOpened] = useState<boolean>(false);
  const [chatFirst, setChatFirst] = useState<boolean>(true);
  const [littleScreen, setLittleScreen] = useState<boolean>(true);
  const [widthStyle, setWidthStyle] = useState<string>("");
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const segment = useSelectedLayoutSegment();
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [moving, setMoving] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setLittleScreen(screenWidth < 1600);

      if (screenWidth < 1600) {
        setWidthStyle("calc(100vw - clamp(60px, 6vw, 120px) - 10px)");
        if (bubbleRef.current) {
          bubbleRef.current.style.left = `${positionX}px`;
          bubbleRef.current.style.top = `${positionY}px`;
        }
      } else {
        setWidthStyle("calc(clamp(600px, 35vw, 1000px) - 10px)");
        if (bubbleRef.current) {
          bubbleRef.current.style.left = "0px";
          bubbleRef.current.style.top = "0px";
        }
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [positionX, positionY]);

  useEffect(() => {
    document.documentElement.style.setProperty("--width-style", widthStyle);
    document.documentElement.style.setProperty(
      "--position-x",
      positionX.toString()
    );
    document.documentElement.style.setProperty(
      "--position-y",
      positionY.toString()
    );
  }, [widthStyle, positionX, positionY]);

  const openChat = () => {
    if (!littleScreen) {
      setChatFirst(false);
      setChatOpened(!chatOpened);
    } else if (!moving && bubbleRef.current) {
      setChatFirst(false);
      if (!chatOpened) {
        bubbleRef.current.style.left = "0px";
        bubbleRef.current.style.top = "0px";
      } else {
        bubbleRef.current.style.left = `${positionX}px`;
        bubbleRef.current.style.top = `${positionY}px`;
      }
      setChatOpened(!chatOpened);
    }
  };

  useEffect(() => {
    const canGoX = (x: number): boolean => {
      if (bubbleRef.current) {
        const left = bubbleRef.current.getBoundingClientRect().left;
        return (
          left + x >= 0 &&
          x + bubbleRef.current.offsetWidth <= window.innerWidth
        );
      }
      return false;
    };

    const canGoY = (y: number): boolean => {
      if (bubbleRef.current) {
        return (
          y >= 0 &&
          y + offset.y + bubbleRef.current.offsetHeight <= window.innerHeight
        );
      }
      return false;
    };

    const handleMouseDown = (event: any) => {
      if (littleScreen && bubbleRef.current) {
        const parent = bubbleRef.current.parentElement;

        if (parent) {
          const rect = bubbleRef.current.getBoundingClientRect();
          const offsetX = event.touches
            ? event.touches[0].pageX - rect.left
            : event.pageX - rect.left;
          const offsetY = event.touches
            ? event.touches[0].pageY -
              rect.top +
              parent.getBoundingClientRect().top
            : event.pageY - rect.top + parent.getBoundingClientRect().top;
          setOffset({ x: offsetX, y: offsetY });
        }
      }
    };

    const handleMouseMove = (event: any) => {
      if (littleScreen && !chatOpened && dragging && bubbleRef.current) {
        setMoving(true);
        const positionX = event.touches
          ? event.touches[0].pageX - offset.x
          : event.pageX - offset.x;
        const positionY = event.touches
          ? event.touches[0].pageY - offset.y
          : event.pageY - offset.y;

        if (canGoX(positionX)) {
          bubbleRef.current.style.left = `${positionX}px`;
          setPositionX(positionX);
        }
        if (canGoY(positionY)) {
          bubbleRef.current.style.top = `${positionY}px`;
          setPositionY(positionY);
        }
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("touchstart", handleMouseDown, { passive: false });
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging, offset, chatOpened, littleScreen]);

  const handleMouseDown = () => {
    if (littleScreen) setDragging(true);
    setMoving(false);
  };

  return (
    <>
      {segment !== "create" && (
        <>
          <div className={styles.display} ref={bubbleRef}>
            {!chatOpened && (
              <FontAwesomeIcon
                icon={faComments}
                className={styles.menu}
                onClick={openChat}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              />
            )}

            {chatOpened && (
              <FontAwesomeIcon
                icon={faArrowLeft}
                className={styles.menu}
                onClick={openChat}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              />
            )}
          </div>

          {!littleScreen && (
            <div className={styles.chatTotalBig}>
              <ChatBubbles />
              <ChatMain
                chatOpened={chatOpened}
                chatFirst={chatFirst}
                widthStyle={widthStyle}
              />
            </div>
          )}
          {littleScreen && (
            <div
              className={
                chatFirst
                  ? styles.littleFirst
                  : chatOpened
                  ? styles.chatTotalLittle
                  : styles.close
              }
            >
              <ChatBubbles />
              <ChatMain
                chatOpened={chatOpened}
                chatFirst={chatFirst}
                widthStyle={widthStyle}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
