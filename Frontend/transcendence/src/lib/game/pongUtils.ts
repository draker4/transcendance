export enum Direction {
  Idle,
  Up,
  Down,
  Left,
  Right,
}

export enum DirX {
  Left = -1,
  Idle = 0,
  Right = 1,
}

export enum DirY {
  Up = -1,
  Idle = 0,
  Down = 1,
}

export function generateRoundColor(actualColor: string): string {
  const colors: string[] = ["#0000FF", "#000FFF", "#FFF000", "#000000"];
  const newColor = colors[Math.floor(Math.random() * colors.length)];
  if (newColor === actualColor) {
    return generateRoundColor(actualColor);
  }
  return newColor;
}

export function turnDelayIsOver(timer: number) {
  return new Date().getTime() - timer >= 1000;
}
