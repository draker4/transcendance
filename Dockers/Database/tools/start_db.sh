#!/bin/bash

echo "Begin Database configuration"

# Change les variable dans le script d'initialisation de la db
sed -i "s/DATA_BASE_NAME/$DATA_BASE_NAME/g" ./migrate.sql
sed -i "s/DATA_BASE_PASSWORD/$DATA_BASE_PASSWORD/g" ./migrate.sql
sed -i "s/DATA_BASE_USER/$DATA_BASE_USER/g" ./migrate.sql
sed -i "s/port = .*/port = $DATA_BASE_PORT/" /etc/postgresql/13/main/postgresql.conf

echo "adding postgres command to path"
echo "export PATH+=:/usr/lib/postgresql/13/bin" >> ~/.bashrc
export PATH+=:/usr/lib/postgresql/13/bin

if [ ! -d "/var/lib/postgresql/data" ]; then

	echo "no user or database created"
	pg_ctlcluster 13 main start

	echo "creating user"
	#createuser crunchy

	echo "creating database"
	#createdb crunchydb -O crunchy

	echo "give acces to the user"
	#psql -c "alter user crunchy with encrypted password 'crunchypass';"
	#psql -c "grant all privileges on database crunchydb to crunchy;"
	#psql -c "revoke all privileges on database crunchydb from postgres;"

	#Load le script d'initialisation de la db
    # echo "loading migrate.sql"
	psql -U crunchy -d crunchydb -a -f migrate.sql

	pg_ctlcluster 13 main stop
fi

echo "starting postgresql service"
#tail -f /dev/null
postgres -D /etc/postgresql/13/main
