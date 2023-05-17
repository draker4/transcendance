#!/bin/bash

echo "Begin Database configuration"

echo "---------------Adding postgres command to path----------"
export PATH+=:/usr/lib/postgresql/13/bin

# Si premier demarage , on configure la database
if [ ! -d "/etc/postgresql/13/conf_done" ]; then
    echo "---------No database found, creating one------------"

    sed -i "s/port = .*/port = $DATA_BASE_PORT/" /etc/postgresql/13/main/postgresql.conf
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/13/main/postgresql.conf
    echo "host  all  all 0.0.0.0/0 md5" >> /etc/postgresql/13/main/pg_hba.conf

    pg_ctlcluster 13 main start

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
fi

echo "---------------Starting postgresql service---------------"
postgres -D /etc/postgresql/13/main

