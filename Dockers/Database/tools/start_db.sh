#!/bin/bash

echo "Begin Database configuration"

echo "adding postgres command to path"
echo "export PATH+=:/usr/lib/postgresql/13/bin" >> ~/.bashrc
export PATH+=:/usr/lib/postgresql/13/bin

if [ ! -d "/var/lib/postgresql/data" ]; then

	echo "no user or database created"
	pg_ctlcluster 13 main start

	echo "creating database"
	#postfres -c "create database crunchydb;"
	createuser crunchy
	createdb crunchydb -O crunchy

	echo "creating user"
	#postgres -c "create user crunchy with encrypted password 'crunchypass';"

	#echo "add password to the superuser"
	#echo "give acces to the user"
	psql -c "alter user crunchy with encrypted password 'crunchypass';"
	psql -c "grant all privileges on database crunchydb to crunchy;"
	psql -c "revoke all privileges on database crunchydb from postgres;"

	pg_ctlcluster 13 main stop
fi

echo "starting postgresql service"
#tail -f /dev/null
postgres -D /etc/postgresql/13/main
