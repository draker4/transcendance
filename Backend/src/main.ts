import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(
    session({
      secret: 'jkjzgvrbfvkjerbvjhtrbvjgr',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(parseInt(process.env.PORT_NESTJS));
}
bootstrap();
