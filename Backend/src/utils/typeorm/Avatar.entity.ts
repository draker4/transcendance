/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Avatar {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@CreateDateColumn()
 	createdAd: Date;

	@UpdateDateColumn()
  	updatedAt: Date;

	@Column({ nullable: true })
	image: string;

	@Column({ nullable: true })
	text: string;

	@Column()
	variant: string;

	@Column()
	borderColor: string;

	@Column()
	backgroundColor: string;

	@Column()
	empty: boolean;

	@Column()
	isChannel: boolean;
}
