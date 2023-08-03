import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Global

  @Column()
  userId: number;

  @Column({ default: 0 })
  leagueXP: number;

  @Column({ default: 0 })
  playerXP: number;

  // League stats

  @Column({ default: 0 })
  leagueGamePlayed: number;

  @Column({ default: 0 })
  leagueGameWon: number;

  @Column({ default: 0 })
  leagueGameLost: number;

  @Column({ default: 0 })
  leagueRoundPlayed: number;

  @Column({ default: 0 })
  leagueRoundWon: number;

  @Column({ default: 0 })
  leagueRoundLost: number;

  @Column({ default: 0 })
  leaguePointPlayed: number;

  @Column({ default: 0 })
  leaguePointWon: number;

  @Column({ default: 0 })
  leaguePointLost: number;

  // Party stats

  @Column({ default: 0 })
  partyGamePlayed: number;

  @Column({ default: 0 })
  partyGameWon: number;

  @Column({ default: 0 })
  partyGameLost: number;

  @Column({ default: 0 })
  partyRoundPlayed: number;

  @Column({ default: 0 })
  partyRoundWon: number;

  @Column({ default: 0 })
  partyRoundLost: number;

  @Column({ default: 0 })
  partyPointPlayed: number;

  @Column({ default: 0 })
  partyPointWon: number;

  @Column({ default: 0 })
  partyPointLost: number;

  // Training stats

  @Column({ default: 0 })
  trainingGamePlayed: number;

  @Column({ default: 0 })
  trainingGameWon: number;

  @Column({ default: 0 })
  trainingGameLost: number;

  @Column({ default: 0 })
  trainingRoundPlayed: number;

  @Column({ default: 0 })
  trainingRoundWon: number;

  @Column({ default: 0 })
  trainingRoundLost: number;

  @Column({ default: 0 })
  trainingPointPlayed: number;

  @Column({ default: 0 })
  trainingPointWon: number;

  @Column({ default: 0 })
  trainingPointLost: number;
}
