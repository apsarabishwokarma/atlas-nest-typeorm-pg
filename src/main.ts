import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AppConfigService } from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  const configService = app.get<AppConfigService>(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: configService.getOrThrow('FRONTEND_ORIGIN', { infer: true }),
  });

  await app.listen(configService.getOrThrow('PORT', { infer: true }));
}
await bootstrap();
