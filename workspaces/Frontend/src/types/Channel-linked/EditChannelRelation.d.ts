type NewRelationDto = {
  isChanOp?: boolean;
  isBanned?: boolean;
  joined?: boolean;
  invited?: boolean;
};

export type EditChannelRelation = {
  channelId: number,
  userId: number,
  newRelation: NewRelation;
};
