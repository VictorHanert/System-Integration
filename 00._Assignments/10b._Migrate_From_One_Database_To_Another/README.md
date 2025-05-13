## Formål
Migrer brugerdata fra én PostgreSQL-database til en anden ved hjælp af Node.js og Knex.js.

## Struktur
- **.env.source**: Definerer kilde-databasen (`sourcedb` på port 5433)
- **.env.target**: Definerer mål-databasen (`targetdb` på port 5434)
- **docker-compose.yml**: Starter begge databaser med named volumes
- **seed-source.js**: Opretter og fylder `sourcedb.users` med testdata
- **migrate.js**:
    - Læser begge `.env`-filer separat
    - Sikrer at `users`-tabellen findes i `targetdb`
    - Kopierer alle rækker fra `sourcedb.users` til `targetdb.users`

Efter migreringen indeholder begge databaser en `users`-tabel med 3 brugere.

# Docker-compose
docker-compose down -v 	# “-v” deletes the named volumes so the DB init runs again
docker-compose up -d

#  Verify you can connect manually once they’re up:
psql -h localhost -p 5433 -U myuser -d sourcedb
psql -h localhost -p 5434 -U myuser -d targetdb

These commands will connect to the source and target databases, respectively. 
You can use the `\l` command in psql to list all databases and verify that you are connected to the correct one.

# Run migration
npm run migrate

This command will run the migration script defined in your package.json file.
"migrate": "node src/migrate.js"

