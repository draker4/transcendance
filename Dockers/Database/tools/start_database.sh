#!/bin/bash

#Change les variable d'environnement dans le fichier migrate.sql
sed -i "s/DATA_BASE_PASSWORD/$DATA_BASE_PASSWORD/g" ./migrate.sql
sed -i "s/DATA_BASE_USER/$DATA_BASE_USER/g" ./migrate.sql
sed -i "s/port = .*/port = $DB_PORT/" /etc/postgresql/13/main/postgresql.conf

echo "Begin Database configuration"

echo "adding postgres command to path"
echo "export PATH+=:/usr/lib/postgresql/13/bin" >> ~/.bashrc
export PATH+=:/usr/lib/postgresql/13/bin

if [ ! -d "/var/lib/postgresql/data" ]; then

	echo "no user or database created"
	pg_ctlcluster 13 main start

	echo "creating user"
	createuser crunchy

	echo "creating database"
	createdb crunchydb -O crunchy

	pg_ctlcluster 13 main stop
fi

echo "starting postgresql service"
postgres -D /etc/postgresql/13/main
