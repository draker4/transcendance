import { GameData } from "@Shared/types/Game.types";

type Props = {
  gameData: GameData;
};

export default function WIPPong({ gameData }: Props) {
  if (!gameData) return <div>Game not found</div>;
  return (
    <div>
      <h1>WIP Pong</h1>
      <p>Game ID: {gameData.id}</p>
      <p>Game Name: {gameData.name}</p>
      <h2>Game Ball</h2>
      <p>img: {gameData.ball.img}</p>
      <p>posX: {gameData.ball.img}</p>
      <p>posY: {gameData.ball.img}</p>
      <h2>Game Player</h2>
      <p>
        Player Left: {gameData.playerLeft?.id} {gameData.playerLeft?.name}
      </p>
      <p>
        Player Right: {gameData.playerRight?.id} {gameData.playerRight?.name}
      </p>
    </div>
  );
}
