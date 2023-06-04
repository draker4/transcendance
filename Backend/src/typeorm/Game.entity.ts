import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {

  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  Name: string;

  @Column()
  Password?: string;

  @Column()
  Host: number;

  @Column()
  Opponent: number;

  @Column("integer", { array: true, default: [] })
  Viewers_List: number[];
  
  @Column()
  Score_Host: number;

  @Column()
  Score_Opponent: number;

  @Column()
  Status: string;

  @Column()
  CreatedAt: string;

  @Column()
  Winner: number;

  @Column()
  Loser: number;
}
