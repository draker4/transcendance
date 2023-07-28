# Base image
FROM node:latest

WORKDIR /home

# RUN apt-get update && apt-get install -y \
# 	curl npm procps \
# 	&& apt-get clean \
# 	&& rm -rf /var/lib/apt/lists/*

# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
# 	&& apt-get install -y nodejs \
# 	&& npm install -g @nestjs/cli

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/Backend ./workspaces/Backend
COPY ./workspaces/Shared ./workspaces/Shared

RUN yarn install

EXPOSE 4000

ENTRYPOINT ["yarn", "start:dev:backend"]
