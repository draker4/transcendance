export function turnDelayIsOver(timer: number) {
  return new Date().getTime() - timer >= 1000;
}
