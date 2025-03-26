## Integration 

To integrate PostgreSQL and access it via the CLI, follow these steps:

### Install PostgreSQL

(If not already), install PostgreSQL using Homebrew:

```bash
brew install postgresql
```

Verify the installation:

```bash
psql --version
```

### Access the Database

When the ngrok server is running (setup by Victor running ngrok tcp 5432), ask for the URL and port to access the database. 
(The URL and port are different for each time the ngrok server is started.)

But it wil look like this:
```bash
psql -d granular_access_db -h 4.tcp.eu.ngrok.io -p 16331 -U admin
```

```bash
-h {NGROK_URL}
-p {NGROK_PORT}
-U {ROLE}
```

**Available Roles and Passwords:**

- `admin` with password `secretpassword`
- `readwrite_user` with password `readwritepass`
- `public_user` with password `publicpass`
- `noaccess_user` with password `noaccesspass`

### Check Current User

To see the current user logged in, execute:

```sql
SELECT current_user;
```

For logging in as a different user you need to quit the session with: **\q** - and then login with the new user.

### Role Access Levels

Each role has different access levels:

| Role           | Access Level  | Permissions                                                                 |
|----------------|---------------|-----------------------------------------------------------------------------|
| `admin`        | All           | Full access to all data and permissions.                                     |
| `noaccess_user`| None          | Cannot access any data.                                                     |
| `public_user`  | Public        | Can only read public data (SELECT).                                          |
| `readwrite_user`| Read-Write   | Can read all data except restricted data and can write to read-write data.   |

### Access Data

#### Read Access

To check read access, use:

```sql
SELECT * FROM confidential_data;

SELECT * FROM confidential_data WHERE access_level = 'public';

SELECT * FROM confidential_data WHERE access_level = 'read-only';

SELECT * FROM confidential_data WHERE access_level = 'read-write';

SELECT * FROM confidential_data WHERE access_level = 'restricted';
```

#### Write Access

To check write access, use:

```sql
UPDATE confidential_data SET data = 'new data' WHERE id = 3;
```
```sql
INSERT INTO confidential_data (data, access_level) VALUES ('new data', 'read-write');
```
```sql
DELETE FROM confidential_data WHERE id = 1; -- Public Data

DELETE FROM confidential_data WHERE id = 2; -- Read-Only Data

DELETE FROM confidential_data WHERE id = 3; -- Read-Write Data

DELETE FROM confidential_data WHERE id = 4; -- Restricted Data
```
