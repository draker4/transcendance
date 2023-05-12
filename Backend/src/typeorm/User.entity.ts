import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {

	@PrimaryColumn()
	id: number;

	@Column()
	nickname: string;

	@Column()
	password: string;
}
