FROM node:latest

WORKDIR /home

# # Install react app
# RUN apt-get update && apt-get install -y \
#     curl gnupg npm \
#     && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
#     && apt-get install -y nodejs \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Install npm packages
# RUN npm install -g npm@latest
# RUN npm install -g next@latest

# Entrypoint
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/Frontend ./workspaces/Frontend
COPY ./workspaces/Shared ./workspaces/Shared

RUN yarn install

ENTRYPOINT ["yarn", "start:dev:frontend"]
