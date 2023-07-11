/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("user_channel_relation")
export class UserChannelRelation {

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@PrimaryColumn()
	userId: number;

	@PrimaryColumn()
	channelId: number;

	@Column({ default: false})
	isbanned: boolean;
}
