FROM debian:latest

# Install react app
RUN apt-get update && apt-get install -y \
    curl gnupg npm \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install npm packages
RUN npm install -g npm@latest
RUN npm install -g next@latest

# Entrypoint
COPY ./tools/start_react.sh /
# RUN chmod +x start_react.sh
ENTRYPOINT ["./start_react.sh"]
