import { RGBA } from "../types/Game.types";

export function turnDelayIsOver(timer: number) {
  return new Date().getTime() - timer >= 1000;
}

export function convertColor(hexaColor: string): RGBA {
  const r = parseInt(hexaColor.slice(1, 3), 16);
  const g = parseInt(hexaColor.slice(3, 5), 16);
  const b = parseInt(hexaColor.slice(5, 7), 16);

  const rgb: RGBA = { r, g, b, a: 1 };
  return rgb;
}
