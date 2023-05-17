#!/bin/bash

echo "Begin Database configuration"

# Change les variable dans le script d'initialisation de la db
# sed -i "s/DATA_BASE_NAME/$DATA_BASE_NAME/g" ./migrate.sql
# sed -i "s/DATA_BASE_PASSWORD/$DATA_BASE_PASSWORD/g" ./migrate.sql
# sed -i "s/DATA_BASE_USER/$DATA_BASE_USER/g" ./migrate.sql

#mkdir -p /etc/postgresql/13/
#mkdir -p /var/lib/postgresql/13/
#chmod 777 /var/lib/postgresql/13/

echo "---------------Adding postgres command to path----------"
export PATH+=:/usr/lib/postgresql/13/bin

# Si premier demarage , on configure la database
if [ ! -d "/etc/postgresql/13/conf_done" ]; then
    echo "---------No database found, creating one------------"

    #On change la ou s'enregistre les fichier de la bs , idealement dans le volume....
    #mkdir -p /etc/postgresql/13/data
    #initdb /etc/postgresql/13/data
    #touch /etc/postgresql/13/main/postgresql.auto.conf
    #sed -i "s|data_directory = '/var/lib/postgresql/13/main'|data_directory = '/etc/postgresql/13/main'|" /etc/postgresql/13/main/postgresql.conf   
    
    sed -i "s/port = .*/port = $DATA_BASE_PORT/" /etc/postgresql/13/main/postgresql.conf
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/13/main/postgresql.conf
    echo "host  all  all 0.0.0.0/0 md5" >> /etc/postgresql/13/main/pg_hba.conf

    pg_ctlcluster 13 main start

    #echo "---------------Loading migrate.sql...---------------"
    #psql -U postgres -d postgres -a -f migrate.sql
    echo "---------------Creating user and database...---------------"
    createuser $DATA_BASE_USER
    createdb $DATA_BASE_NAME -O $DATA_BASE_USER
    psql -U $DATA_BASE_SUP_USER -c "ALTER USER $DATA_BASE_USER WITH PASSWORD '$DATA_BASE_PASSWORD';"
    psql -U $DATA_BASE_SUP_USER -c "ALTER USER $DATA_BASE_SUP_USER WITH PASSWORD '$DATA_BASE_SUP_PW';"
    psql -U $DATA_BASE_SUP_USER -c "GRANT ALL PRIVILEGES ON DATABASE $DATA_BASE_NAME TO $DATA_BASE_USER;"
    psql -U $DATA_BASE_SUP_USER -c "GRANT ALL PRIVILEGES ON DATABASE $DATA_BASE_NAME TO $DATA_BASE_SUP_USER;"
    echo "---------------Database configured!------------------"

    pg_ctlcluster 13 main stop

    #On indique que la db est configuré
    touch /etc/postgresql/13/conf_done

    #service postgresql restart
    #service postgresql stop
fi

echo "---------------Starting postgresql service---------------"
postgres -D /etc/postgresql/13/main

