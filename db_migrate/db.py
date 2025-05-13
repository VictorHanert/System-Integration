import pymysql
import psycopg2
from psycopg2 import sql
import sys

# Default database credentials and configurations
MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'rootpassword',
    'database': 'mysql_database',
    'port': 3306
}

PG_CONFIG = {
    'host': 'localhost',
    'user': 'victorhanert',
    'password': '',
    'database': 'postgres',
    'port': 5432
}

def migrate_data():
    # MySQL Connection
    mysql_connection = pymysql.connect(
        host=MYSQL_CONFIG['host'],
        user=MYSQL_CONFIG['user'],
        password=MYSQL_CONFIG['password'],
        database=MYSQL_CONFIG['database'],
        port=MYSQL_CONFIG['port']
    )

    # PostgreSQL Connection
    pg_connection = psycopg2.connect(
        host=PG_CONFIG['host'],
        user=PG_CONFIG['user'],
        password=PG_CONFIG['password'],
        database=PG_CONFIG['database'],
        port=PG_CONFIG['port']
    )

    # Create a cursor for MySQL
    mysql_cursor = mysql_connection.cursor()

    # Create a cursor for PostgreSQL
    pg_cursor = pg_connection.cursor()

    # Step 1: Retrieve data from MySQL
    # CREATE TABLE
    mysql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100)
        );
    """)
    
    mysql_cursor.execute("SELECT id, name, email FROM users;")
    mysql_data = mysql_cursor.fetchall()

    # Step 2: Prepare and insert data into PostgreSQL
    insert_query = sql.SQL("""
        INSERT INTO users (id, name, email)
        VALUES (%s, %s, %s)
    """)

    for row in mysql_data:
        pg_cursor.execute(insert_query, row)

    # Commit the transaction
    pg_connection.commit()

    # Close the cursors and connections
    mysql_cursor.close()
    pg_cursor.close()
    mysql_connection.close()
    pg_connection.close()

    print("Data migration completed successfully.")


if __name__ == "__main__":
    try:
        migrate_data()
    except Exception as e:
        print(f"An error occurred during migration: {e}")
        sys.exit(1)
