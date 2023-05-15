import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/User.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATA_BASE_HOST,
    port: parseInt(process.env.DATA_BASE_PORT),
    username: process.env.DATA_BASE_USER,
    password: process.env.DATA_BASE_PASSWORD,
    database: process.env.DATA_BASE_NAME,
    entities: [User],
    synchronize: true,
  }), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
