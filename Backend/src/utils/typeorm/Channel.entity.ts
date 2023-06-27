/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

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
}
