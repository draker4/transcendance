import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/User.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ValidationSchema } from './validation.schema';
import { MailModule } from './mail/mail.module';

import { GamesModule } from './games/games.module';
// import { GamesController } from './games/games-controller/games-controller.controller';
// import { GamesService } from './games/games-service/games-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATA_BASE_HOST,
      port: parseInt(process.env.DATA_BASE_PORT),
      username: process.env.DATA_BASE_USER,
      password: process.env.DATA_BASE_PASSWORD,
      database: process.env.DATA_BASE_NAME,
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    GamesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
