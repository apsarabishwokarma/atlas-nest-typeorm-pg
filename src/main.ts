import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AppConfigService } from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  const configService = app.get<AppConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: configService.getOrThrow('FRONTEND_ORIGIN', { infer: true }),
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Atlas API')
    .setDescription('Atlas API documentation')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(configService.getOrThrow('PORT', { infer: true }));
}
await bootstrap();
