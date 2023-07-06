// "use client";

// import React, { use, useState } from "react";
// import styles from "@/styles/lobby/Flip_Card.module.css";
// import Image from "next/image";

// import Selector from "@/components/lobby/Selector";
// import SideSelector from "@/components/lobby/SideSelector";
// import Slider from "@/components/lobby/Slider";
// import ImgSelector from "@/components/lobby/ImgSelector";
// import { type } from "os";

// type Props = {
//   Lobby: any;
//   text: string;
//   title: string;
//   img: string;
//   type: string;
// };

// type Game_Settings = {
//   name: string;
//   push: boolean;
//   score: 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   round: 1 | 3 | 5 | 7 | 9;
//   difficulty: 1 | 2 | 3 | 4 | 5;
//   side: "left" | "right";
//   background: string;
//   ball: string;
//   paddle: string;
//   type: string;
//   mode: string;
// };

// export default function Flip_Card({ Lobby, text, title, img, type }: Props) {
//   // -------------------------------------Matchmake-------------------------------------//

//   //True si en matchmake
//   const [inMatchMaking, setinMatchMake] = useState(false);

//   //Fonction pour rejoindre une game
//   const Start_Matchmake = async () => {
//     //Lance la recherche de game
//     const res = await Lobby.Start_Matchmaking();
//     setinMatchMake(res);
//   };

//   //Fonction pour commencer la recherche une game
//   const Stop_Matchmake = async () => {
//     await Lobby.Stop_Matchmaking();
//     setinMatchMake(false);
//   };

//   // -------------------------------------Traning-------------------------------------//

//   //Fonction pour rejoindre une game
//   const Create_Solo = async () => {
//     //Stop le matchmake
//     Stop_Matchmake();

//     //Rejoins la page de solo training
//     Lobby.Load_Page("/home/game");
//   };

//   // -------------------------------------Create-------------------------------------//

//   //Pong Settings

//   const [name, setName] = useState<string>("");
//   const [push, setPush] = useState<boolean>(false);
//   const [score, setScore] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
//   const [round, setRound] = useState<1 | 3 | 5 | 7 | 9>(3);
//   const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
//   const [side, setSide] = useState<"left" | "right">("left");
//   const [background, setBackground] = useState<string>("background/0");
//   const [ball, setBall] = useState<string>("ball/0");
//   const [paddle, setPaddle] = useState<string>("paddle/0");
//   const [typegame, setType] = useState<string>("");
//   const [mode, setMode] = useState<string>("");

//   //Fonction pour rejoindre une game
//   const Create_Game = async () => {
//     //Stop le matchmake
//     Stop_Matchmake();

//     //Creer un objet avec les settings
//     const settings: Game_Settings = {
//       name: name,
//       push: push,
//       score: score,
//       round: round,
//       difficulty: difficulty,
//       side: side,
//       background: background,
//       ball: ball,
//       paddle: paddle,
//       type: typegame,
//       mode: mode,
//     };

//     //Creer la game
//     const res = await Lobby.Create_Game(settings);
//   };

//   return (
//     <main className={styles.flip_card}>
//       <div
//         className={`${styles.inner} ${
//           type === "rank" && inMatchMaking && styles.turned
//         }`}
//       >
//         {/* Front */}
//         <div className={styles.front}>
//           <button className={styles.button}>
//             <div className={styles.button_icone}>
//               <Image
//                 src={`/images/${img}.png`}
//                 alt={text}
//                 width="120"
//                 height="120"
//               />
//             </div>
//             <h1>{title}</h1>
//             <p>{text}</p>
//           </button>
//         </div>

//         {/* Back */}
//         {/* Create back */}
//         {type == "create" && (
//           <div className={styles.back}>
//             <div className={styles.settings}>
//               <form>
//                 {/* Name */}
//                 <label>Name</label>
//                 <input
//                   className={styles.name_input}
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                 />

//                 {/* Push */}
//                 <label>Push</label>
//                 <Selector id="push" value={push} setValue={setPush} />

//                 {/* Score */}
//                 <label>Score</label>
//                 <Slider
//                   min={3}
//                   max={9}
//                   step={1}
//                   value={score}
//                   setValue={setScore}
//                 />

//                 {/* Round */}
//                 <label>Round</label>
//                 <Slider
//                   min={1}
//                   max={9}
//                   step={2}
//                   value={round}
//                   setValue={setRound}
//                 />

//                 {/* Difficulty */}
//                 <label>Difficulty</label>
//                 <Slider
//                   min={1}
//                   max={5}
//                   step={1}
//                   value={difficulty}
//                   setValue={setDifficulty}
//                 />

//                 {/* Side */}
//                 <label>Side</label>
//                 <SideSelector id="side" value={side} setValue={setSide} />

//                 {/* Background */}
//                 <label>Background</label>
//                 <ImgSelector
//                   id="side"
//                   value={background}
//                   setValue={setBackground}
//                   imgs={[
//                     "background/0",
//                     "background/1",
//                     "background/2",
//                     "background/3",
//                   ]}
//                 />

//                 {/* Ball */}
//                 <label>Ball</label>
//                 <ImgSelector
//                   id="side"
//                   value={ball}
//                   setValue={setBall}
//                   imgs={["ball/0", "ball/1", "ball/2", "ball/3"]}
//                 />

//                 {/* Paddle */}
//                 <label>Paddle</label>
//                 <ImgSelector
//                   id="side"
//                   value={paddle}
//                   setValue={setPaddle}
//                   imgs={["paddle/0", "paddle/1", "paddle/2", "paddle/3"]}
//                 />

//                 {/* Validate */}
//                 <button
//                   className={styles.validate_button}
//                   type="button"
//                   onClick={Create_Game}
//                 >
//                   Create game
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Create back */}
//         {type == "training" && (
//           <div className={styles.back}>
//             <p>Training back</p>

//             <button className={styles.button_back_card} onClick={Create_Solo}>
//               <p>Create solo game</p>
//             </button>
//           </div>
//         )}

//         {/* Rank back */}
//         {type == "rank" && (
//           <div className={styles.back}>
//             {inMatchMaking && (
//               <Image
//                 src={`/images/game/balls.gif`}
//                 alt="Searching giff"
//                 width="120"
//                 height="120"
//               />
//             )}

//             {inMatchMaking && (
//               <button
//                 className={styles.button_back_card}
//                 onClick={Stop_Matchmake}
//               >
//                 <p>Stop searching</p>
//               </button>
//             )}

//             {!inMatchMaking && (
//               <button
//                 className={styles.button_back_card}
//                 onClick={Start_Matchmake}
//               >
//                 <p>Start searching</p>
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
