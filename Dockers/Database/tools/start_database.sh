#!/bin/bash

#Change les variable d'environnement dans le fichier 
sed -i "s/DATA_BASE_PASSWORD/$DATA_BASE_PASSWORD/g" ./migrate.sql
sed -i "s/DATA_BASE_USER/$DATA_BASE_USER/g" ./migrate.sql

sed -i "s/port = .*/port = $DB_PORT/" /etc/postgresql/13/main/postgresql.conf

echo "Starting PostgreSql..."

init_base() {
  until pg_isready -h localhost -p $DB_PORT -U postgres > /dev/null 2>&1; do
    sleep 1
  done
  echo "PostgreSQL started."
  psql -U postgres < .migrate.sql
}

# init_base & postgres -D /usr/local/pgsql/data
#Start psql server
init_base & pg_ctl -D /usr/local/pgsql/data -l logfile start

find /tmp/ -name .s.PGSQL.5432
cat /etc/postgresql/13/main/postgresql.conf | grep "port ="
