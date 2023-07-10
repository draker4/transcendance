/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Avatar } from './Avatar.entity';
import { UserChannelRelation } from './UserChannelRelation';

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

	@ManyToMany(() => User, (user) => user.channels)
	users: User[];

	@OneToMany(() => UserChannelRelation, userChannelRelation => userChannelRelation.user)
	userChannelRelations: UserChannelRelation[];

	@OneToOne(() => Avatar)
	@JoinColumn()
	avatar: Avatar;

	@Column({ default: 'default', nullable: false })
	type: 'default' | 'privateMsg';
}
