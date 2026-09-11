import { type ConfigService } from '@nestjs/config';
import { z } from 'zod';

export const configSchema = z.object({
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_MIGRATIONS_RUN: z.stringbool().default(false),
  DATABASE_NAME: z.string().min(1).default('atlas_dev'),
  DATABASE_PASSWORD: z.string().min(1).default('atlas_dev_password'),
  DATABASE_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DATABASE_SYNCHRONIZE: z.stringbool().default(false),
  DATABASE_URL: z.string().url().optional(),
  DATABASE_USER: z.string().min(1).default('atlas'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

export type Config = z.infer<typeof configSchema>;

export function validateConfig(environment: Record<string, unknown>): Config {
  return configSchema.parse(environment);
}

export type AppConfigService = ConfigService<Config, true>;
