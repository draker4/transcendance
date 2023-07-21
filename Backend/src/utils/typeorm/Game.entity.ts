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
  type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';

  @Column()
  mode: 'League' | 'Party' | 'Training';

  @Column()
  host: number;

  @Column({ default: -1 })
  opponent: number;

  @Column()
  hostSide: 'Left' | 'Right';

  @OneToOne(() => Score)
  @JoinColumn()
  score: Score;

  @Column({ default: 'Waiting' })
  status: 'Waiting' | 'Playing' | 'Finished' | 'Deleted';

  @Column({ default: 'Not Started' })
  result:
    | 'Not Started'
    | 'On Going'
    | 'Draw'
    | 'Player1'
    | 'Player2'
    | 'Deleted';

  @Column({ default: 0 })
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column()
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @Column()
  maxRound: 1 | 3 | 5 | 7 | 9;

  @Column()
  difficulty: 1 | 2 | 3 | 4 | 5;

  @Column()
  push: boolean;

  @Column()
  background: string;

  @Column()
  ball: string;
}
