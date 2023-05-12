CREATE DATABASE crunchy_db;

CREATE USER crunchy WITH PASSWORD 'crunchy';
GRANT ALL PRIVILEGES ON DATABASE crunchy_db TO crunchy;

ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE crunchy_db TO postgres;
