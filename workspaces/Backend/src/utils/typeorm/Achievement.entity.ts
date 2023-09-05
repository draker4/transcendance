import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Column()
  userId: number;

  @Column({ default: false })
  achv1Completed: boolean;

  @Column({ default: false })
  achv1TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv1Date: Date;

  @Column({ default: false })
  achv2Completed: boolean;

  @Column({ default: false })
  achv2TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv2Date: Date;

  @Column({ default: false })
  achv3Completed: boolean;

  @Column({ default: false })
  achv3TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv3Date: Date;

  @Column({ default: false })
  achv4Completed: boolean;

  @Column({ default: false })
  achv4TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv4Date: Date;

  @Column({ default: false })
  achv5Completed: boolean;

  @Column({ default: false })
  achv5TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv5Date: Date;

  @Column({ default: false })
  achv6Completed: boolean;

  @Column({ default: false })
  achv6TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv6Date: Date;

  @Column({ default: false })
  achv7Completed: boolean;

  @Column({ default: false })
  achv7TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv7Date: Date;

  @Column({ default: false })
  achv8Completed: boolean;

  @Column({ default: false })
  achv8TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv8Date: Date;

  @Column({ default: false })
  achv9Completed: boolean;

  @Column({ default: false })
  achv9TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv9Date: Date;

  @Column({ default: false })
  achv10Completed: boolean;

  @Column({ default: false })
  achv10TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv10Date: Date;

  @Column({ default: false })
  achv11Completed: boolean;

  @Column({ default: false })
  achv11TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv11Date: Date;

  @Column({ default: false })
  achv12Completed: boolean;

  @Column({ default: false })
  achv12TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv12Date: Date;

  @Column({ default: false })
  achv13Completed: boolean;

  @Column({ default: false })
  achv13TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv13Date: Date;

  @Column({ default: false })
  achv14Completed: boolean;

  @Column({ default: false })
  achv14TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv14Date: Date;

  @Column({ default: false })
  achv15Completed: boolean;

  @Column({ default: false })
  achv15TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv15Date: Date;

  @Column({ default: false })
  achv16Completed: boolean;

  @Column({ default: false })
  achv16TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv16Date: Date;

  @Column({ default: false })
  achv17Completed: boolean;

  @Column({ default: false })
  achv17TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv17Date: Date;

  @Column({ default: false })
  achv18Completed: boolean;

  @Column({ default: false })
  achv18TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv18Date: Date;

  @Column({ default: false })
  achv19Completed: boolean;

  @Column({ default: false })
  achv19TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv19Date: Date;

  @Column({ default: false })
  achv20Completed: boolean;

  @Column({ default: false })
  achv20TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv20Date: Date;

  @Column({ default: false })
  achv21Completed: boolean;

  @Column({ default: false })
  achv21TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv21Date: Date;

  @Column({ default: false })
  achv22Completed: boolean;

  @Column({ default: false })
  achv22TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv22Date: Date;

  @Column({ default: false })
  achv23Completed: boolean;

  @Column({ default: false })
  achv23TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv23Date: Date;

  @Column({ default: false })
  achv24Completed: boolean;

  @Column({ default: false })
  achv24TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv24Date: Date;

  @Column({ default: false })
  achv25Completed: boolean;

  @Column({ default: false })
  achv25TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv25Date: Date;

  @Column({ default: false })
  achv26Completed: boolean;

  @Column({ default: false })
  achv26TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv26Date: Date;

  @Column({ default: false })
  achv27Completed: boolean;

  @Column({ default: false })
  achv27TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv27Date: Date;

  @Column({ default: false })
  achv28Completed: boolean;

  @Column({ default: false })
  achv28TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv28Date: Date;

  @Column({ default: false })
  achv29Completed: boolean;

  @Column({ default: false })
  achv29TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv29Date: Date;

  @Column({ default: false })
  achv30Completed: boolean;

  @Column({ default: false })
  achv30TBA: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  achv30Date: Date;
}
