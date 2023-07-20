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
