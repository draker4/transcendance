#!/bin/bash

echo "Begin Database configuration"

# Change les variable dans le script d'initialisation de la db
# sed -i "s/DATA_BASE_NAME/$DATA_BASE_NAME/g" ./migrate.sql
# sed -i "s/DATA_BASE_PASSWORD/$DATA_BASE_PASSWORD/g" ./migrate.sql
# sed -i "s/DATA_BASE_USER/$DATA_BASE_USER/g" ./migrate.sql

# mkdir -p /etc/postgresql/13/data
# chmod -R 750 /etc/postgresql/13/data 

echo "adding postgres command to path"
export PATH+=:/usr/lib/postgresql/13/bin

Si premier demarage , on configure la database
if [ ! -d "/etc/postgresql/13/conf_done" ]; then
    echo "---------No database found, creating one----------------"

    pg_ctlcluster 13 main start

    echo "loading migrate.sql..."
    psql -U postgres -d postgres -a -f migrate.sql
    echo "migrate.sql loaded!"

    pg_ctlcluster 13 main stop

    # sed -i "s|data_directory = '/var/lib/postgresql/13/main'|data_directory = '/etc/postgresql/13/data'|" /etc/postgresql/13/main/postgresql.conf   
    sed -i "s/port = .*/port = $DATA_BASE_PORT/" /etc/postgresql/13/main/postgresql.conf
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/13/main/postgresql.conf
    echo "host  all  all 0.0.0.0/0 md5" >> /etc/postgresql/13/main/pg_hba.conf

    #On indique que la db est configuré
    touch /etc/postgresql/13/conf_done

    service postgresql restart
    service postgresql stop
fi

echo "starting postgresql service"
postgres -D /etc/postgresql/13/main

