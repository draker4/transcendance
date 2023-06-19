"use client"

import { useEffect, useRef, useState } from "react";
import ChatBubbles from "./ChatBubbles"
import ChatMain from "./ChatMain"
import styles from "@/styles/chat/Chat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faComments } from "@fortawesome/free-solid-svg-icons";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Chat() {

	const	[chatOpened, setChatOpened] = useState<boolean>(false);
	const	[chatFirst, setChatFirst] = useState<boolean>(true);
	const	[littleScreen, setLittleScreen] = useState<boolean>(true);
	const	[isClosing, setIsClosing] = useState<boolean>(false);
	const	[widthStyle, setWidthStyle] = useState<string>("");
	const	segment = useSelectedLayoutSegment();
	const	bubbleRef = useRef<HTMLDivElement>(null);
	const	[dragging, setDragging] = useState(false);
	const	[moving, setMoving] = useState(false);
	const	[offset, setOffset] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleResize = () => {

			const screenWidth = window.innerWidth;
			setLittleScreen(screenWidth < 800);

			if (screenWidth < 800)
				setWidthStyle("calc(100vw - clamp(60px, 5vw, 80px) - 10px)");
			else
				setWidthStyle("calc(clamp(400px, 35vw, 600px) - 10px)");
			};
	
		handleResize();
	
		window.addEventListener("resize", handleResize);
	
		return () => {
		  window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		document.documentElement.style.setProperty('--width-style', widthStyle);
	}, [widthStyle]);

	const	openChat = () => {
		
		setChatFirst(false);
		
		if (!littleScreen) {
			setChatOpened(!chatOpened);
		}
		else if (!moving) {
			if (chatOpened) {
				setIsClosing(true);
				setTimeout(() => {
					setChatOpened(false);
				}, 500);
			}
			else {
				setChatOpened(true);
				setIsClosing(false);
			}
		}
	}

	useEffect(() => {
		const handleMouseDown = (event: MouseEvent | TouchEvent) => {
			if (littleScreen && bubbleRef.current) {
				
				const	parent = bubbleRef.current.parentElement;

				if (parent && event instanceof MouseEvent) {
					const rect = bubbleRef.current.getBoundingClientRect();
					const offsetX = event.pageX - rect.left;
					const offsetY = event.pageY - rect.top + parent.getBoundingClientRect().top;
					setOffset({ x: offsetX, y: offsetY });
				}

				if (parent && event instanceof TouchEvent) {
					const rect = bubbleRef.current.getBoundingClientRect();
					const offsetX = event.touches[0].pageX - rect.left;
					const offsetY = event.touches[0].pageY - rect.top + parent.getBoundingClientRect().top;
					setOffset({ x: offsetX, y: offsetY });
				}
			}
		};
	
		const handleMouseMove = (event: MouseEvent | TouchEvent) => {
			if (littleScreen && !chatOpened && dragging && bubbleRef.current && event instanceof MouseEvent) {
				setMoving(true);
				bubbleRef.current.style.left = `${event.pageX - offset.x}px`;
				bubbleRef.current.style.top = `${event.pageY - offset.y}px`;
			}
			
			if (littleScreen && !chatOpened && dragging && bubbleRef.current && event instanceof TouchEvent) {
				event.preventDefault();
				setMoving(true);
				bubbleRef.current.style.left = `${event.touches[0].pageX - offset.x}px`;
				bubbleRef.current.style.top = `${event.touches[0].pageY - offset.y}px`;
			}
		};
	
		const handleMouseUp = () => {
		  setDragging(false);
		};
	
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	
		window.addEventListener('touchstart', handleMouseDown, { passive: false });
		window.addEventListener('touchmove', handleMouseMove, { passive: false });
		window.addEventListener('touchend', handleMouseUp);
	
		return () => {
		  window.removeEventListener('mousedown', handleMouseDown);
		  window.removeEventListener('mousemove', handleMouseMove);
		  window.removeEventListener('mouseup', handleMouseUp);

		  window.removeEventListener('touchstart', handleMouseDown);
		  window.removeEventListener('touchmove', handleMouseMove);
		  window.removeEventListener('touchend', handleMouseUp);
		};
	}, [dragging, offset]);

	const	handleMouseDown = () => {
		if (littleScreen)
			setDragging(true);
		setMoving(false);
	}

	return (
		<>
		{
			segment !== 'create' &&
			<>
				<div
					className={styles.display}
					ref={bubbleRef}
					onMouseDown={handleMouseDown}
					onTouchStart={handleMouseDown}
					// onMouseMove={handleMouseMove}
					// onMouseUp={handleMouseUp}
				>
					{ (!chatOpened || isClosing) && 
						<FontAwesomeIcon
							icon={faComments}
							className={styles.menu}
							onClick={openChat}
						/>
					}

					{ chatOpened && !isClosing &&
						<FontAwesomeIcon
							icon={faArrowLeft} 
							className={styles.menu}
							onClick={openChat}
						/>
					}
				</div>

				{
					!littleScreen && 
					<div className={styles.chatTotalBig}>
						<ChatBubbles />
						<ChatMain
							chatOpened={chatOpened}
							chatFirst={chatFirst}
							widthStyle={widthStyle}
							isClosing={isClosing}
						/>
					</div>
				}
				{
					littleScreen && chatOpened &&
					<div className={isClosing ? styles.close : styles.chatTotalLittle}>
						<ChatBubbles />
						<ChatMain
							chatOpened={chatOpened}
							chatFirst={chatFirst}
							widthStyle={widthStyle}
							isClosing={isClosing}
						/>
					</div>
				}
			</>
		}
		</>
	);
}
