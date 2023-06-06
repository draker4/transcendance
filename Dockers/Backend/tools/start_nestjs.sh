#!/bin/bash

echo "Begin NestJS configuration"

mkdir -p nest-project/config
chmod -R 777 nest-project

#If no react projet , create one
if [ ! -d "./nest-project/node_modules" ]; then
    echo "No NestJS project found, creating one..."
    nest new nest-project --package-manager npm

    echo "adding packages"
    npm add @nestjs@typeorm typeorm pg class-validator \
    class-transformer @nestjs/config joi \
    @nestjs/passport passport passport-local \
    @nestjs/jwt passport-jwt \
    @nestjs-modules/mailer nodemailer \
    bcrypt
	npm add uuid
	npm add winston nest-winston

    npm add -D @types/bcrypt

    echo "NestJS project created"

    sed -i 's/3000/4000/g' ./nest-project/src/main.ts
fi

cd nest-project

npm install

echo "start server"
npm run start:dev
