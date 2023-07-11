/* eslint-disable prettier/prettier */

import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Channel } from "./Channel.entity";


@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;
  
	@CreateDateColumn()
	createdAd: Date;
  
	@UpdateDateColumn()
	updatedAt: Date;

	@Column()
	content: string;

	// Relation Many<Message> [to] one<Channel>
	@ManyToOne(() => Channel, (channel) => channel.messages)
	channel: Channel;






}