import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppConfigService, validateConfig } from './config/env.validation.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const appDirectory = dirname(fileURLToPath(import.meta.url));
const databaseMigrations = [
  join(appDirectory, 'database/migrations/*{.ts,.js}'),
];

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL', {
          infer: true,
        });

        return {
          type: 'postgres' as const,
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                database: configService.getOrThrow('DATABASE_NAME', {
                  infer: true,
                }),
                host: configService.getOrThrow('DATABASE_HOST', {
                  infer: true,
                }),
                password: configService.getOrThrow('DATABASE_PASSWORD', {
                  infer: true,
                }),
                port: configService.getOrThrow('DATABASE_PORT', {
                  infer: true,
                }),
                username: configService.getOrThrow('DATABASE_USER', {
                  infer: true,
                }),
              }),
          autoLoadEntities: true,
          migrations: databaseMigrations, // where the migrations file should be stored
          migrationsRun: configService.getOrThrow('DATABASE_MIGRATIONS_RUN', {
            infer: true,
          }), // run migrations from migrations folder automatically on app startup
          synchronize: configService.getOrThrow('DATABASE_SYNCHRONIZE', {
            infer: true,
          }), // run migrations without creating files for migrations (not recommended for production)
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
