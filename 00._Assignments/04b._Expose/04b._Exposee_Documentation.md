

# This is how I have set the DB and server up:

## Install PostgreSQL with Docker
docker network create pg-network

docker run --name my-postgres \
  --network pg-network \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secretpassword \
  -e POSTGRES_DB=mydatabase \
  -p 5432:5432 \
  -d postgres:latest


docker ps
Outputs:
CONTAINER ID   IMAGE             COMMAND                  CREATED          STATUS          PORTS                    NAMES
ab9251db5ce7   postgres:latest   "docker-entrypoint.s…"   46 seconds ago   Up 45 seconds   0.0.0.0:5432->5432/tcp   my-postgres

## Connect to PostgreSQL
To connect to the PostgreSQL database locally, run the following command:
```bash
docker exec -it my-postgres psql -U admin -d mydatabase
```

## Create a Database and Table for Granular Access Control
Create a new database:
```sql
DROP DATABASE IF EXISTS granular_access_db;
CREATE DATABASE granular_access_db;
```

Switch to the new database:
```bash
\c granular_access_db
```

Create a table to store confidential data:

```sql
DROP TABLE IF EXISTS confidential_data;

CREATE TABLE confidential_data (
    id SERIAL PRIMARY KEY,
    data TEXT,
    access_level VARCHAR(20)
);

INSERT INTO confidential_data (data, access_level) VALUES 
('Public Data', 'public'),
('Read-Only Data', 'read-only'),
('Read and Write Data', 'read-write'),
('Restricted Data', 'restricted');
```

## Create Users with Granular Permissions

Create Users with Granular Permissions:

```sql
DROP USER IF EXISTS readwrite_user;
DROP USER IF EXISTS public_user;
DROP USER IF EXISTS noaccess_user;

CREATE USER readwrite_user WITH PASSWORD 'readwritepass';
CREATE USER public_user WITH PASSWORD 'publicpass';
CREATE USER noaccess_user WITH PASSWORD 'noaccesspass';
```

## Grant Permissions with Row-Level Security (RLS) Policies:

To enforce granular access control, we'll use PostgreSQL's Row-Level Security (RLS) policies. These policies allow us to define rules that restrict which rows users can access based on specific conditions.

**Public User:** Can only read public data.

1.  **Revoke Default Permissions:** Start by revoking all default public permissions on the `confidential_data` table:

    ```sql
    REVOKE ALL ON TABLE confidential_data FROM PUBLIC;
    ```

2.  **Grant Basic Read Permission:** Grant the `public_user` basic read access to the table:

    ```sql
    GRANT SELECT ON TABLE confidential_data TO public_user;
    ```

3.  **Enable Row-Level Security:** Enable RLS on the `confidential_data` table:

    ```sql
    ALTER TABLE confidential_data ENABLE ROW LEVEL SECURITY;
    ```

4.  **Create RLS Policy:** Create a policy that allows the `public_user` to select only rows where the `access_level` column is 'public':

    ```sql
    DROP POLICY IF EXISTS public_data_policy ON confidential_data;

    CREATE POLICY public_data_policy ON confidential_data
    FOR SELECT TO public_user
    USING (access_level = 'public');
    ```

**Read-Write User:** Can read and write specific data.

1.  **Grant Basic Read and Write Permissions:** Grant the `readwrite_user` basic read, insert, update, and delete access to the table:

    ```sql
    GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE confidential_data TO readwrite_user;
    ```

2.  **Create RLS Policies:** Create policies to restrict access:

    * **Restrict Read access to ID 1, 2 and 3:** Allow `SELECT` only on the rows with id 1,2, and 3.

        ```sql
        DROP POLICY IF EXISTS readwrite_read_policy ON confidential_data;

        CREATE POLICY readwrite_read_policy ON confidential_data
        FOR SELECT TO readwrite_user
        USING (id IN (1, 2, 3));
        ```

    * **Restrict Write Access to ID 3:** Allow `UPDATE`, `INSERT`, and `DELETE` only on the row with `id = 3`:

        ```sql
        DROP POLICY IF EXISTS readwrite_write_restricted_update ON confidential_data;
        DROP POLICY IF EXISTS readwrite_write_restricted_insert ON confidential_data;
        DROP POLICY IF EXISTS readwrite_write_restricted_delete ON confidential_data;

        CREATE POLICY readwrite_write_restricted_update ON confidential_data
        FOR UPDATE TO readwrite_user
        USING (id = 3);

        CREATE POLICY readwrite_write_restricted_insert ON confidential_data
        FOR INSERT TO readwrite_user
        WITH CHECK (id = 3);

        CREATE POLICY readwrite_write_restricted_delete ON confidential_data
        FOR DELETE TO readwrite_user
        USING (id = 3);
        ```
    * **General Write Access to ID 1:** Allow `UPDATE`, `INSERT`, and `DELETE` on the row with id 1.

        ```sql
        DROP POLICY IF EXISTS readwrite_general_update ON confidential_data;
        DROP POLICY IF EXISTS readwrite_general_insert ON confidential_data;
        DROP POLICY IF EXISTS readwrite_general_delete ON confidential_data;

        CREATE POLICY readwrite_general_update ON confidential_data
        FOR UPDATE TO readwrite_user
        USING (id = 1);

        CREATE POLICY readwrite_general_insert ON confidential_data
        FOR INSERT TO readwrite_user
        WITH CHECK (id = 1);

        CREATE POLICY readwrite_general_delete ON confidential_data
        FOR DELETE TO readwrite_user
        USING (id = 1);
        ```


## How to access the users locally:
(If you are in the psql) get out of the shell: 
```bash
\q
```
Then access one of the users for testing:
```bash
docker exec -it my-postgres psql -U admin -d granular_access_db
docker exec -it my-postgres psql -U readwrite_user -d granular_access_db
docker exec -it my-postgres psql -U readonly_user -d granular_access_db
docker exec -it my-postgres psql -U noaccess_user -d granular_access_db
```

Get the data:
```sql
SELECT current_user;
SELECT * from confidential_data;
```

Get specific data:
```sql
SELECT * from confidential_data WHERE access_level = 'public';
SELECT * from confidential_data WHERE access_level = 'read-only';
SELECT * from confidential_data WHERE access_level = 'read-write';
SELECT * from confidential_data WHERE access_level = 'restricted';
```


## Install and Configure HTTP Tunnel with Ngrok access to the database
Download and setup ngrok

When done run:
```bash
ngrok tcp 5432
```
Account: Victor (Plan: Free) - need to setup a payment method to get TCP tunnels. - This card will NOT be charged.
Forwarding: tcp://2.tcp.eu.ngrok.io:10732 -> localhost:5432  

Note: The ngrok URL and port will change each time the server restarts, so ensure that the integrator gets the updated link and port when testing.