/* eslint-disable prettier/prettier */
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
  createdAd: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  hostRound1: number;

  @Column({ default: 0 })
  opponentRound1: number;

  @Column({ default: 0 })
  hostRound2: number;

  @Column({ default: 0 })
  opponentRound2: number;

  @Column({ default: 0 })
  hostRound3: number;

  @Column({ default: 0 })
  opponentRound3: number;

  @Column({ default: 0 })
  hostRound4: number;

  @Column({ default: 0 })
  opponentRound4: number;

  @Column({ default: 0 })
  hostRound5: number;

  @Column({ default: 0 })
  opponentRound5: number;

  @Column({ default: 0 })
  hostRound6: number;

  @Column({ default: 0 })
  opponentRound6: number;

  @Column({ default: 0 })
  hostRound7: number;

  @Column({ default: 0 })
  opponentRound7: number;

  @Column({ default: 0 })
  hostRound8: number;

  @Column({ default: 0 })
  opponentRound8: number;

  @Column({ default: 0 })
  hostRound9: number;

  @Column({ default: 0 })
  opponentRound9: number;
}
