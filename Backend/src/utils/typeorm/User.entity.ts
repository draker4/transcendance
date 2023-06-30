import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  AfterLoad,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Channel } from './Channel.entity';
import { Avatar } from './Avatar.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAd: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  login: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  passwordHashed: string;

  @Column({ nullable: true })
  verifyCode: string;

  @Column({ nullable: true, type: 'bigint' })
  expirationCode: number;

  @Column()
  verified: boolean;

  @Column()
  provider: string;

  @Column({ nullable: true })
  motto: string;

  @Column({ nullable: true })
  story: string;

  @Column()
  logged: boolean;

  @ManyToMany(() => Channel, (channel) => channel.users)
  @JoinTable()
  channels: Channel[];

  @ManyToMany(() => User, (user) => user.pongies)
  @JoinTable()
  pongies: User[];

  @OneToOne(() => Avatar)
  @JoinColumn()
  avatar: Avatar;

  @AfterLoad()
  async nullChecks() {
    if (!this.channels) {
      this.channels = [];
    }

    if (!this.pongies) {
      this.pongies = [];
    }
  }
}
