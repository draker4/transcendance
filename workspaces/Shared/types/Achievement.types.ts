export type FullAchievement = {
  id: string;
  name: string;
  description: string;
  type: string;
  xp: number;
  completed: boolean;
};

export type AchievementStatus = {
  id: string;
  completed: boolean;
  toBeAnnounced: boolean;
};

export type UserAchievement = {
  list: FullAchievement[];
  toBeAnnounced: string[];
};
