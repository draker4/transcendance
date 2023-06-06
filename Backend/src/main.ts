import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    // logger: WinstonModule.createLogger({
    //   transports: [
    //     // let's log errors into its own file
    //     new transports.File({
    //       filename: `logs/error.log`,
    //       level: 'error',
    //       format: format.combine(
    //         format.timestamp(),
    //         format.printf((info) => {
    //           return `${info.timestamp} ${info.level}: ${info.message}`;
    //         }),
    //         ),
    //     }),
    //     // logging all level
    //     new transports.File({
    //       filename: `logs/combined.log`,
    //       format: format.combine(format.timestamp(), format.json()),
    //     }),
    //     // we also want to see logs in our console
    //     new transports.Console({
    //     format: format.combine(
    //       format.cli(),
    //       format.splat(),
    //       format.timestamp(),
    //       format.printf((info) => {
    //         return `${info.timestamp} ${info.level}: ${info.message}`;
    //       }),
    //       ),
    //   }),
    //   ],
    // }),
  });

  app.setGlobalPrefix('api');
  app.enableCors({origin: '*'});
  await app.listen(parseInt(process.env.PORT_NESTJS));
}
bootstrap();
