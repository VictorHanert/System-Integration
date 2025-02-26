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

When the ngrok server is running (setup by Victor running ngrok tcp 5432), use the following command to access the database. Replace `{ROLE}` with the appropriate role and enter the corresponding password when prompted:

```bash
psql -h 2.tcp.eu.ngrok.io -U {ROLE} -d granular_access_db -p 10732
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