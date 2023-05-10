# Base image
FROM debian:stable-20230320-slim

RUN apt-get update && apt-get install -y \
	curl \
	npm \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
	&& apt-get install -y nodejs \
	&& npm install -g @nestjs/cli

WORKDIR /home/NestJS/

EXPOSE 3000

# Entrypoint
COPY ./tools/start_nestjs.sh /
#RUN chmod +x ./start_nestjs.sh
#ENTRYPOINT ["start_nestjs.sh"]

CMD ["tail", "-f", "/dev/null"]
