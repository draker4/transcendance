// type Player = {
//   // Fixed Data
//   id: number;
//   name: string;
//   color: string; // attention si couleur du player = couleur du background
//   side: "Left" | "Right";

//   // Dynamic Data
//   posX: number;
//   posY: number;
//   speed: number;
//   move: Direction;
//   push: number;

//   // Game Data
//   score: number;
//   roundWon: number;
// };

// type Ball = {
//   // Fixed Data
//   img: string | null;
//   color: string; // utiliser uniquement si img = null et faire attention si couleur du ball = couleur du background

//   // Dynamic Data
//   posX: number;
//   posY: number;
//   speed: number;
//   moveX: number;
//   moveY: number;
//   push: number;
// };

// type Draw = {
//   canvas: HTMLCanvasElement;
//   context: CanvasRenderingContext2D;
// };

// type Game = {
//   // Fixed Data from Backend
//   uuid: string;
//   name: string;
//   ball: Ball;
//   playerLeft: Player;
//   playerRight: Player;
//   playerSide: "Left" | "Right" | null;
//   background: string;
//   type: "Classic" | "Best3" | "Best5" | "Custom" | "Training";
//   difficulty: 1 | 2 | 3 | 4 | 5;
//   AI: boolean;
//   fontColor: string; // define font color based on background
//   roundColor: string; // define font color based on background
//   roundWinColor: string; // define font color based on background

//   // Dynamic Data
//   playerServe: "Left" | "Right" | null;
//   actualRound: number;
//   maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   maxRound: 1 | 3 | 5 | 7 | 9;
//   timer: number;
//   push: boolean;
//   status: "Waiting" | "Playing" | "Finished" | "Deleted";
//   result: "Player1" | "Player2" | "Draw" | "On Going" | "Not Started";
// };

// type GameSettings = {
//   uuid: string;
//   name: string;
//   hostName: number;
//   opponentName: number;
//   push: boolean;
//   maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   maxRound: 1 | 3 | 5 | 7 | 9;
//   hostSide: "Left" | "Right";
//   difficulty: 1 | 2 | 3 | 4 | 5;
//   background: string;
//   ball: string;
//   type: string;
// };

// type GameData = {
//   uuid: string;
//   name: string;
//   host: player;
//   opponent: player;
//   push: boolean;
//   actualRound: number;
//   maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   maxRound: 1 | 3 | 5 | 7 | 9;
//   hostSide: "Left" | "Right";
//   difficulty: 1 | 2 | 3 | 4 | 5;
//   background: string;
//   ball: string;
//   type: string;
// };
