FROM debian:stable-20230320-slim

#RUN mkdir -p /etc/postgresql/13
#RUN chmod 777 -R /etc/postgresql/13

RUN apt-get update
RUN apt-get install -y \
	postgresql-13 \
	postgresql-client-13 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

COPY ./tools/start_db.sh /
RUN chmod +x start_db.sh

RUN mkdir -p /var/lib/postgresql/13/main \
	&& chown -R postgres:postgres /var/lib/postgresql/13 \
	&& chmod 0750 /var/lib/postgresql/13/main

USER postgres

EXPOSE 5432

ENTRYPOINT ["./start_db.sh"]
