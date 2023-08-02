// handle random background and ball
import {
  BACKGROUND,
  BALL,
} from "@transcendence/shared/constants/Asset.constants";

export const confirmBackground = (background: string) => {
  if (background === "Random") {
    const randomBackgroundIndex = Math.floor(
      Math.random() * (BACKGROUND.length - 1)
    );
    background = BACKGROUND[randomBackgroundIndex];
  }
  return background;
};

export const confirmBall = (ball: string) => {
  if (ball === "Random") {
    const randomBallIndex = Math.floor(Math.random() * (BALL.length - 1));
    ball = BALL[randomBallIndex];
  }
  return ball;
};
