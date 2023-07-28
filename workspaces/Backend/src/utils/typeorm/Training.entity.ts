import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Training {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'training_id',
  })
  trainingId: number;

  @Column({
    nullable: false,
  })
  level: number;

  @Column({
    nullable: false,
    default: '',
  })
  title: string;

  @Column({
    nullable: false,
    default: '',
  })
  description: string;

  @Column({
    nullable: false,
    default: false,
  })
  push: boolean;

  @Column({
    nullable: false,
    default: 3,
  })
  score: number;

  @Column({
    nullable: false,
    default: 3,
  })
  round: number;

  @Column({
    nullable: false,
    default: 0,
  })
  difficulty: number;

  @Column({
    nullable: true,
    default: '',
  })
  background: string;

  @Column({
    nullable: true,
    default: '',
  })
  ball: string;
}
