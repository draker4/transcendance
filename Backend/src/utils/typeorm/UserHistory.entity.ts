import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'user_history_id',
  })
  userHistoryId: number;

  @Column({
    nullable: false,
    name: 'user_id',
  })
  userId: number;

  @Column({
    nullable: false,
    name: 'history_id',
  })
  historyId: number;

  @Column({
    nullable: false,
    default: false,
  })
  success: boolean;
}
