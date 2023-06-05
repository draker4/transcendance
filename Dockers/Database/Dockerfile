FROM debian:stable-20230320-slim

RUN apt-get update
RUN apt-get install -y \
	postgresql-13 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

COPY ./tools/start_db.sh /
RUN chmod +x start_db.sh

#RUN mkdir -p /var/lib/postgresql/13/main \
#	&& chown -R postgres:postgres /var/lib/postgresql/13 \
#	&& chmod 750 /var/lib/postgresql/13/main

USER postgres

EXPOSE 5432

ENTRYPOINT ["./start_db.sh"]
#CMD ["tail", "-f", "/dev/null"]
