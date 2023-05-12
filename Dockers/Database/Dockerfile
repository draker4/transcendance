FROM debian:stable-20230320-slim

#Create directory
RUN mkdir -p ./data
RUN chmod -R 777 ./data

# Update and get postgresql
RUN apt-get update
RUN apt-get install -y \
	postgresql-13 \
	postgresql-client-13 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# Entrypoint
COPY ./tools/migrate.sql /
RUN chmod +x migrate.sql

# Entrypoint
COPY ./tools/start_database.sh /
RUN chmod +x start_database.sh

USER postgres

ENTRYPOINT ["./start_database.sh"]