type NewRelation = {
  isChanOp?: boolean;
  isBanned?: boolean;
  joined?: boolean;
  invited?: boolean;
};

export type EditChannelRelation = {
  channelId: number,
  userId: number,
  senderId: number,
  newRelation: NewRelation;
};
