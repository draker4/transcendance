export type FullAchievement = {
  id: string;
  code: string;
  name: string;
  description: string;
  type: string;
  xp: number;
  completed: boolean;
  date: Date;
  icone: string;
  value: number;
};

export type AchievementStatus = {
  id: string;
  completed: boolean;
  toBeAnnounced: boolean;
  date: Date;
};

export type UserAchievement = {
  list: FullAchievement[];
  lastThree: FullAchievement[];
  toBeAnnounced: string[];
};
