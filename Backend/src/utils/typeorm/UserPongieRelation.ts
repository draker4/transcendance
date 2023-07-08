/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("user_pongie_relation")
export class UserPongieRelation {

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@PrimaryColumn()
	userId: number;

	@PrimaryColumn()
	friendId: number;

	@Column({ default: false})
	isFriend: boolean;

	@Column({ default: false})
	invited: boolean;
}
