/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notif {

	@PrimaryGeneratedColumn()
	id: number;

	@Column("int", { array: true, default: {} })
	redPongies: number[];

	@Column("int", { array: true, default: {} })
	redChannels: number[];

	@Column("int", { array: true, default: {} })
	nbMessages: number[];
}
