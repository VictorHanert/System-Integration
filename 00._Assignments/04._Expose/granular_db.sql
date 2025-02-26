-- Drop the database if it exists
DROP DATABASE IF EXISTS granular_access_db;

-- Create the database
CREATE DATABASE granular_access_db;

-- Connect to the new database
\c granular_access_db

-- Drop the confidential_data table if it exists
DROP TABLE IF EXISTS confidential_data;

-- Create the confidential_data table
CREATE TABLE confidential_data (
    id SERIAL PRIMARY KEY,
    data TEXT,
    access_level VARCHAR(20)
);

-- Insert initial data into the confidential_data table
INSERT INTO confidential_data (data, access_level) VALUES 
('Public Data', 'public'),
('Read-Only Data', 'read-only'),
('Read and Write Data', 'read-write'),
('Restricted Data', 'restricted');

-- Drop users if they exist
DROP USER IF EXISTS readwrite_user;
DROP USER IF EXISTS public_user;
DROP USER IF EXISTS noaccess_user;

-- Create users with granular permissions
CREATE USER readwrite_user WITH PASSWORD 'readwritepass';
CREATE USER public_user WITH PASSWORD 'publicpass';
CREATE USER noaccess_user WITH PASSWORD 'noaccesspass';

-- Revoke default permissions on the confidential_data table
REVOKE ALL ON TABLE confidential_data FROM PUBLIC;

-- Grant basic read permission to public_user
GRANT SELECT ON TABLE confidential_data TO public_user;

-- Enable Row-Level Security on the confidential_data table
ALTER TABLE confidential_data ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS public_data_policy ON confidential_data;
DROP POLICY IF EXISTS readwrite_read_policy ON confidential_data;
DROP POLICY IF EXISTS readwrite_write_restricted_update ON confidential_data;
DROP POLICY IF EXISTS readwrite_write_restricted_insert ON confidential_data;
DROP POLICY IF EXISTS readwrite_write_restricted_delete ON confidential_data;
DROP POLICY IF EXISTS readwrite_general_update ON confidential_data;
DROP POLICY IF EXISTS readwrite_general_insert ON confidential_data;
DROP POLICY IF EXISTS readwrite_general_delete ON confidential_data;

-- Create RLS policy for public_user to select only rows where access_level is 'public'
CREATE POLICY public_data_policy ON confidential_data
FOR SELECT TO public_user
USING (access_level = 'public');

-- Grant basic read and write permissions to readwrite_user
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE confidential_data TO readwrite_user;

-- Create RLS policies for readwrite_user
-- Restrict read access to ID 1, 2, and 3
CREATE POLICY readwrite_read_policy ON confidential_data
FOR SELECT TO readwrite_user
USING (id IN (1, 2, 3));

-- Restrict write access to ID 3
CREATE POLICY readwrite_write_restricted_update ON confidential_data
FOR UPDATE TO readwrite_user
USING (id = 3);

CREATE POLICY readwrite_write_restricted_insert ON confidential_data
FOR INSERT TO readwrite_user
WITH CHECK (id = 3);

CREATE POLICY readwrite_write_restricted_delete ON confidential_data
FOR DELETE TO readwrite_user
USING (id = 3);

-- General write access to ID 1
CREATE POLICY readwrite_general_update ON confidential_data
FOR UPDATE TO readwrite_user
USING (id = 1);

CREATE POLICY readwrite_general_insert ON confidential_data
FOR INSERT TO readwrite_user
WITH CHECK (id = 1);

CREATE POLICY readwrite_general_delete ON confidential_data
FOR DELETE TO readwrite_user
USING (id = 1);