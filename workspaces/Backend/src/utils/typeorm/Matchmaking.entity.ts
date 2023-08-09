import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Matchmaking {
  @PrimaryGeneratedColumn()
  Waiter_Id: number;

  @Column()
  Player_Id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  Type: string;
}
