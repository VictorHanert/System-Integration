#!/usr/bin/env node
import path from 'path';
import dotenv from 'dotenv';
import Knex from 'knex';

// Antal rækker per batch ved indsættelse
const BATCH_SIZE = 500;

// 1) .env for Postgres og MySQL
dotenv.config({ path: path.resolve(process.cwd(), '.env.source') });
const pgEnv = process.env;

dotenv.config({ path: path.resolve(process.cwd(), '.env.target') });
const myEnv = process.env;

// 2) Type‐mapping fra Postgres → MySQL
const TYPE_MAP = {
  int2:      'SMALLINT',
  int4:      'INT',
  int8:      'BIGINT',
  numeric:   'DECIMAL(38,10)',
  bool:      'TINYINT(1)',
  text:      'TEXT',
  varchar:   'VARCHAR(255)',
  bpchar:    'CHAR(1)',
  date:      'DATE',
  timestamp: 'DATETIME',
  timestamptz:'DATETIME',
  json:      'JSON',
  jsonb:     'JSON',
};

// 3) Opret Knex‐forbindelser
const pg = Knex({
  client: 'pg',
  connection: {
    host:     pgEnv.POSTGRES_HOST,
    port:     Number(pgEnv.POSTGRES_PORT),
    user:     pgEnv.POSTGRES_USER,
    password: pgEnv.POSTGRES_PASSWORD,
    database: pgEnv.POSTGRES_DB,
  },
});

const mysql = Knex({
  client: 'mysql2',
  connection: {
    host:     myEnv.MYSQL_HOST,
    port:     Number(myEnv.MYSQL_PORT),
    user:     myEnv.MYSQL_USER,
    password: myEnv.MYSQL_PASSWORD,
    database: myEnv.MYSQL_DATABASE,
  },
});

// Byg CREATE TABLE DDL for MySQL ud fra Postgres‐kolonnedata
function buildCreateTableDDL(tableName, columns) {
  // columns = array af objekter: { column_name, udt_name, is_nullable }
  const colLines = columns.map(col => {
    const mysqlType = TYPE_MAP[col.udt_name] || 'TEXT';
    const nullSpec  = col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL';
    return `\`${col.column_name}\` ${mysqlType} ${nullSpec}`;
  });
  return `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${colLines.join(', ')});`;
}

// Kopier tabel fra Postgres til MySQL
async function copyTable(tableName) {
  console.log(`\n▶ Migrating table: ${tableName}`);

  // Hent kolonnemetadata fra Postgres
  const columns = await pg
    .select('column_name', 'udt_name', 'is_nullable')
    .from('information_schema.columns')
    .where({ table_name: tableName, table_schema: 'public' });

  // Opret table i MySQL, if dont exists
  const createDDL = buildCreateTableDDL(tableName, columns);
  await mysql.raw(createDDL);
  await mysql.raw(`TRUNCATE TABLE \`${tableName}\`;`); // slet for at sikre, at tabellen er tom

  // Hent og indsæt data i batches
  let offset = 0;
  while (true) {
    const rows = await pg.select('*')
                     .from(tableName)
                     .limit(BATCH_SIZE)
                     .offset(offset);

    if (rows.length === 0) break;

    await mysql.batchInsert(tableName, rows, BATCH_SIZE);
    offset += rows.length;
    process.stdout.write(`copied ${offset} rows\r`);
  }
}

// Main function: find alle tabeller og migrate dem
(async () => {
  try {
    // Hent alle base tables fra Postgres
    const tables = await pg
      .select('table_name')
      .from('information_schema.tables')
      .where({ table_schema: 'public', table_type: 'BASE TABLE' });

    // For hver tabel: migrer
    for (const { table_name } of tables) {
      // Spring migra­tion‐tabeller og sparket metadata over, hvis du vil
      if (table_name === 'knex_migrations' || table_name === 'knex_migrations_lock') {
        continue;
      }
      await copyTable(table_name);
    }
    console.log('\n All tables migrated successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pg.destroy();
    await mysql.destroy(); // Luk forbindelser
    process.exit(0);
  }
})();
