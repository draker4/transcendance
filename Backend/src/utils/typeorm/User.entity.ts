/* eslint-disable prettier/prettier */
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
  OneToMany,
} from 'typeorm';
import { Channel } from './Channel.entity';
import { Avatar } from './Avatar.entity';
import { UserPongieRelation } from './UserPongieRelation';
import { UserChannelRelation } from './UserChannelRelation';
import { Token } from './Token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

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

  @Column({ nullable: true, default: 0 })
  trainingLevel: number;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true})
  twoFactorAuthenticationSecret: string;

  @ManyToMany(() => Channel, (channel) => channel.users)
  @JoinTable({
    name: 'user_channel_relation',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
  })
  channels: Channel[];

  @OneToMany(
    () => UserChannelRelation,
    (userChannelRelation) => userChannelRelation.channel,
  )
  userChannelRelations: UserChannelRelation[];

  @ManyToMany(() => User, (user) => user.pongies)
  @JoinTable({
    name: 'user_pongie_relation',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'pongieId',
      referencedColumnName: 'id',
    },
  })
  pongies: User[];

  @OneToMany(
    () => UserPongieRelation,
    (userPongieRelation) => userPongieRelation.pongie,
  )
  userPongieRelations: UserPongieRelation[];

  @OneToMany(
    () => UserPongieRelation,
    (pongieUserRelation) => pongieUserRelation.pongie,
  )
  pongieUserRelations: UserPongieRelation[];

  @OneToOne(() => Avatar)
  @JoinColumn()
  avatar: Avatar;

  @OneToMany(() => Token, token => token.user)
  tokens: Token[];

  @AfterLoad()
  async nullChecks() {
    if (!this.channels) {
      this.channels = [];
    }

    if (!this.pongies) {
      this.pongies = [];
    }

    if (!this.userPongieRelations) {
      this.userPongieRelations = [];
    }

    if (!this.pongieUserRelations) {
      this.pongieUserRelations = [];
    }

    if (!this.userChannelRelations) {
      this.userChannelRelations = [];
    }

    if (!this.tokens) {
      this.tokens = [];
    }
  }
}
