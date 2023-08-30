/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// process.env.TZ = 'Africa/Maputo';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger({
        transports: [
          // let's log errors into its own file
          new transports.File({
            filename: process.env.ERROR_LOG_PATH || `logs/error.log`,
            level: 'error',
            format: format.combine(
              format.timestamp(),
              format.printf((info) => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
              }),
            ),
          }),
          // logging all levels
          new transports.File({
            filename: process.env.COMBINED_LOG_PATH || `logs/combined.log`,
            format: format.combine(format.timestamp(), format.json()),
          }),
          // we also want to see logs in our console
          new transports.Console({
            format: format.combine(
              format.cli(),
              format.splat(),
              format.timestamp(),
              format.printf((info) => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
              }),
            ),
          }),
        ],
        exceptionHandlers: [
          new transports.File({
            filename: process.env.EXCEPTION_LOG_PATH || 'logs/exceptions.log',
            format: format.combine(
              format.timestamp(),
              format.metadata(),
              format.printf((info) => {
                if (info.metadata && info.metadata.stack) {
                  return `${info.timestamp} ${info.level}: ${info.message}\n${info.metadata.stack}`;
                }
                return `${info.timestamp} ${info.level}: ${info.message}`;
              }),
            ),
          }),
        ],
      }),
    });

    app.enableCors({
      origin: `http://${process.env.HOST_IP}:3000`,
      credentials: true,
    });
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(parseInt(process.env.PORT_NESTJS));
    console.log(`Application is running on port ${process.env.PORT_NESTJS}`);
  } catch (error) {
    console.error('Error during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();
