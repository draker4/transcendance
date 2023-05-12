#!/bin/bash

echo "Begin Database configuration"

# Change les variable dans le script d'initialisation de la db
# sed -i "s/DATA_BASE_NAME/$DATA_BASE_NAME/g" ./migrate.sql
# sed -i "s/DATA_BASE_PASSWORD/$DATA_BASE_PASSWORD/g" ./migrate.sql
# sed -i "s/DATA_BASE_USER/$DATA_BASE_USER/g" ./migrate.sql

mkdir -p /var/lib/postgresql/13/
chmod 750 /var/lib/postgresql/13/main

echo "adding postgres command to path"
export PATH+=:/usr/lib/postgresql/13/bin

if [ psql -l | grep crunchy_db ]; then
	echo "Database exists"
else

	echo "No database found, creating one"

	pg_ctlcluster 13 main start

	echo "loading migrate.sql..."
	psql -U postgres -d postgres -a -f migrate.sql
	echo "migrate.sql loaded!"

	echo "add addresses in configuration files"
	sed -i "s/port = .*/port = $DATA_BASE_PORT/" /etc/postgresql/13/main/postgresql.conf
	sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/13/main/postgresql.conf

	pg_ctlcluster 13 main stop

fi

chmod 777 /var/lib/postgresql/13

echo "starting postgresql service"
postgres -D /etc/postgresql/13/main

