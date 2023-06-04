import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Matchmaking {

  @PrimaryGeneratedColumn()
  Player: number;

  @CreateDateColumn()
  createdAt: Date;
}
