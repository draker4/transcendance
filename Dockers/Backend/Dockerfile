# Base image
FROM debian:stable-20230320-slim

RUN apt-get update && apt-get install -y \

	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /run/php /var/www/html

WORKDIR /var/www/html/

COPY ./tools/start_wp.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start_wp.sh
ENTRYPOINT ["/usr/local/bin/start_wp.sh"]

EXPOSE 9000

CMD ["/usr/sbin/php-fpm7.4", "-F"]
