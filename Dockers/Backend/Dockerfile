# Base image
FROM debian:latest

RUN apt-get update && apt-get install -y \
	curl npm procps \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
	&& apt-get install -y nodejs \
	&& npm install -g @nestjs/cli

EXPOSE 4000

# Entrypoint
COPY ./tools/start_nestjs.sh /
# RUN chmod +x start_nestjs.sh
ENTRYPOINT ["./start_nestjs.sh"]
