/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Token {

	@PrimaryGeneratedColumn()
	id: number;
	
	@CreateDateColumn()
	createdAd: Date;
  
	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ nullable: false })
	value: string;

	@Column({ nullable: false, default: 0})
	NbOfRefreshes: number;

	@ManyToOne(() => User, user => user.tokens)
  	user: User;
}
