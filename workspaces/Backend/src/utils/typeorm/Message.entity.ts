/* eslint-disable prettier/prettier */

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './Channel.entity';
import { User } from './User.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  content: string;

  // Relation Many<Message> [to] one<Channel>
  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;

  // Relation one message to one user (unidirectionnel)
  @ManyToOne(() => User)
  @JoinColumn()
  user?: User;

  // Si pas de user === server message/notif
  // en plus par securite un booleen isServerNotif par defaut a fasle
  @Column('boolean', { default: false })
  isServerNotif = false;
}
