import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Game {

  @PrimaryGeneratedColumn()
  id: number;

  // @CreateDateColumn()
  // createdAd: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;

  // @Column()
  // login: string;

  // @Column()
  // email: string;

  // @Column({ nullable: true })
  // first_name: string;

  // @Column({ nullable: true })
  // last_name: string;

  // @Column({ nullable: true })
  // phone: string;

  // @Column({ nullable: true })
  // image: string;

  // @Column({ nullable: true })
  // password: string;

  // @Column({ nullable: true })
  // verifyCode: string;

  // @Column({ nullable: true, type: 'bigint' })
  // expirationCode: number;

  // @Column()
  // verified: boolean;
}
