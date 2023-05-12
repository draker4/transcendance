FROM debian:stable-20230320-slim

#Create directory
RUN mkdir -p ./data
RUN chmod -R 777 ./data

#Update upgrade
RUN apt-get update && apt-get install -y \
    postgresql \
    # postgresql-contrib \
    # postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#Copie le fichier de configuration de la database
COPY ./tools/migrate.sql /
RUN chmod +x migrate.sql

# Entrypoint
COPY ./tools/start_database.sh /
RUN chmod +x start_database.sh
ENTRYPOINT ["./start_database.sh"]

CMD ["postgres"]