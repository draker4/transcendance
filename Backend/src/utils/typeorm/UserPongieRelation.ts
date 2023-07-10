/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { Channel } from "./Channel.entity";

@Entity("user_pongie_relation")
export class UserPongieRelation {

	@PrimaryGeneratedColumn()
	relationId: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@PrimaryColumn()
	userId: number;

	@PrimaryColumn()
	pongieId: number;
	
	@ManyToOne(() => User, (user) => user.userPongieRelations)
    user: User;
	
	@ManyToOne(() => User, (pongie) => pongie.pongieUserRelations)
    pongie: User;

	@Column({ default: false})
	isFriend: boolean;

	@Column({ default: false})
	invited: boolean;

	@Column({ default: false})
	deleted: boolean;
}
