import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Score } from './Score.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  host: number;

  @Column({ default: -1 })
  opponent: number;

  @OneToOne(() => Score)
  @JoinColumn()
  score: Score;

  @Column({ default: 'Waiting' })
  status: 'Waiting' | 'Playing' | 'Finished' | 'Deleted';

  @Column({ default: 'Not Started' })
  result: 'Player1' | 'Player2' | 'Draw' | 'On Going' | 'Not Started';

  @Column({ default: 0 })
  actualRound: number;

  @Column()
  maxPoint: number;

  @Column()
  maxRound: number;

  @Column()
  hostSide: 'Left' | 'Right';

  @Column()
  difficulty: number;

  @Column()
  push: boolean;

  @Column()
  background: string;

  @Column()
  ball: string;

  @Column()
  type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';
}
