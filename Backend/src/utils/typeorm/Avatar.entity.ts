import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Avatar {
	
	@PrimaryColumn()
	userId: number;

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
}
