/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { Channel } from "./Channel.entity";

@Entity("user_channel_relation")
export class UserChannelRelation {

	@PrimaryGeneratedColumn()
	relationId: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@PrimaryColumn()
	userId: number;

	@PrimaryColumn()
	channelId: number;
	
	@ManyToOne(() => User, (user) => user.userChannelRelations)
    user: User;
	
	@ManyToOne(() => Channel, (channel) => channel.userChannelRelations)
    channel: Channel;

	@Column({ default: false})
	isbanned: boolean;

	@Column({ default: true })
	joined: boolean;
}
