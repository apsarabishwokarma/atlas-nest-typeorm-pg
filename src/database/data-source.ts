import 'dotenv/config';
import 'reflect-metadata';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';

const databaseDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = dirname(databaseDirectory);
const databaseUrl = process.env.DATABASE_URL;

// This DataSource is used by the TypeORM CLI. It is separate from Nest's
// runtime connection because the CLI does not bootstrap the Nest container.
export default new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? { url: databaseUrl }
    : {
        database: process.env.DATABASE_NAME ?? 'atlas_dev',
        host: process.env.DATABASE_HOST ?? 'localhost',
        password: process.env.DATABASE_PASSWORD ?? 'atlas_dev_password',
        port: Number(process.env.DATABASE_PORT ?? 5432),
        username: process.env.DATABASE_USER ?? 'atlas',
      }),
  entities: [join(sourceDirectory, '**/*.entity{.ts,.js}')], // load entities from every module
  migrations: [join(databaseDirectory, 'migrations/*{.ts,.js}')],
  migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
});
