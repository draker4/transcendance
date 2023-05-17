FROM debian:stable-20230320-slim

RUN mkdir -p /etc/postgresql/13
RUN chmod 777 -R /etc/postgresql/13

RUN apt-get update
RUN apt-get install -y \
	postgresql-13 \
	postgresql-client-13 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

COPY ./tools/start_db.sh /
RUN chmod +x start_db.sh

COPY ./tools/migrate.sql /
RUN chmod 777 migrate.sql

USER postgres

EXPOSE 5432

ENTRYPOINT ["./start_db.sh"]
