/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Avatar } from './Avatar.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAd: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ default: 'default', nullable: false })
  type: 'default' | 'privateMsg';

  @ManyToMany(() => User, (user) => user.channels)
  users: User[];

  @OneToOne(() => Avatar)
  @JoinColumn()
  avatar: Avatar;
}
