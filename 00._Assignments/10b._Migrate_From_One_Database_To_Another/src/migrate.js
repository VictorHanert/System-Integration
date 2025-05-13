#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Knex from 'knex';

const BATCH_SIZE = 500;

// 1) Parse .env.source + .env.target
function loadEnv(file) {
  const envPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(envPath)) {
    console.error(`❌ Could not find ${file} in ${process.cwd()}`);
    process.exit(1);
  }
  return dotenv.parse(fs.readFileSync(envPath));
}

const srcEnv    = loadEnv('.env.source');
const targetEnv = loadEnv('.env.target');

// 2) Helper: Build Knex config
function createKnexConfig(env) {
  return {
    client: 'pg',
    connection: {
      host:     env.POSTGRES_HOST,
      port:     Number(env.POSTGRES_PORT),
      user:     env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
    },
    migrations: { directory: './migrations' },
    seeds:      { directory: './seeds' },
    pool:       { min: 0, max: 10 },
  };
}

const sourceConfig = createKnexConfig(srcEnv);
const targetConfig = createKnexConfig(targetEnv);

// 3) Helper: Migrate one table
async function migrateTable(src, tgt, tableName) {
  process.stdout.write(`→ ${tableName}… `);
  await tgt.raw(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);

  let offset = 0;
  while (true) {
    const rows = await src(tableName)
      .select('*')
      .limit(BATCH_SIZE)
      .offset(offset);
    if (rows.length === 0) break;
    await tgt.batchInsert(tableName, rows, BATCH_SIZE);
    offset += rows.length;
  }
  console.log(`done (copied ${offset} rows)`);
}

// 4) Main migration routine
async function main() {
  const src = Knex(sourceConfig);
  const tgt = Knex(targetConfig);

  try {
    console.log('🔧 Running SOURCE migrations…');
    await src.migrate.latest();

    console.log('🌱 Running SOURCE seeds…');
    await src.seed.run();

    console.log('🔧 Running TARGET migrations…');
    await tgt.migrate.latest();

    console.log('📦 Copying data from SOURCE → TARGET…');
    const tables = await src('information_schema.tables')
      .select('table_name')
      .where({
        table_schema: 'public',
        table_type:   'BASE TABLE',
      })
      .whereNotIn('table_name', [
        'knex_migrations',
        'knex_migrations_lock'
      ]);

    for (const { table_name } of tables) {
      await migrateTable(src, tgt, table_name);
    }

    console.log('✅ All tables migrated!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await src.destroy();
    await tgt.destroy();
  }
}

main();
