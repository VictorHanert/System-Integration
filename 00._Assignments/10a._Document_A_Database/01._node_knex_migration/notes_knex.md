**Alembic**: A lightweight Python migration tool for SQLAlchemy. Manages schema changes in a version-controlled way.

**Knex**: A Node.js SQL query builder with a migration tool for structured schema management.

The migration scripts reflect the current state of the schema and how it evolved over time.

## Two types of migrations
Schema migration (DDL)
Data migration / Seeding (DML)

Data migration usually refers to moving data from one database to another.
Seeding is the process of populating a database with data, usually a new database.

Confusingly, they are all referred to as simply migration.


# Connect to Knex:
docker-compose up
docker ps
docker exec -it <container_id> psql -U myuser -d mydatabase

# In another terminal:
npx knex migrate:make create_some_table
npx knex migrate:latest
npx knex migrate:rollback

npx knex seed:make seed_some_table
npx knex seed:run
npx knex seed:rollback