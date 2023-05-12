# Base image
FROM debian:stable-20230320-slim

RUN apt-get update
RUN apt-get install -y \
	postgresql-13 \
	postgresql-client-13 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

EXPOSE 5432

COPY ./tools/start_db.sh /
RUN chmod +x start_db.sh

USER postgres

ENTRYPOINT ["./start_db.sh"]
