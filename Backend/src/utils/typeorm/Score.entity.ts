import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdtd: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  hostRoundWon: 0 | 1 | 2 | 3 | 4;

  @Column({ default: 0 })
  opponentRoundWon: 0 | 1 | 2 | 3 | 4;

  @Column({ default: 0 })
  hostRound1: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound1: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound2: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound2: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound3: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound3: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound4: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound4: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound5: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound5: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound6: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound6: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound7: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound7: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound8: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound8: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  hostRound9: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column({ default: 0 })
  opponentRound9: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}
