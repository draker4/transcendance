CREATE DATABASE crunchy_db;

CREATE USER crunchy WITH PASSWORD 'crunchy';
GRANT ALL PRIVILEGES ON DATABASE crunchy_db TO crunchy;

ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE crunchy_db TO postgres;

\c crunchy_db
CREATE TABLE Users (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL);
INSERT INTO Users (name) VALUES ('Timto'), ('Loup'), ('Baptiste');

CREATE TABLE Messages (id SERIAL PRIMARY KEY, content VARCHAR(255) NOT NULL, user_id INTEGER NOT NULL);
