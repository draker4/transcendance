#!/bin/bash

echo "Connecting to PostgreSQL..."
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -d crunchy_db -U postgres
echo "Connection closed."

SHOW hba_file;