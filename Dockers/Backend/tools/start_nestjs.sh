#!/bin/bash

echo "Begin NestJS configuration"

mkdir -p nest-project/config
# chmod -R 777 nest-project

#If no react projet , create one
# if [ ! -d "./nest-project/node_modules" ]; then
#     echo "No NestJS project found, creating one..."
#     nest new nest-project --package-manager npm

#     # echo "adding packages"
#     # npm add @nestjs@typeorm typeorm pg class-validator \
#     # class-transformer @nestjs/config joi \
#     # @nestjs/passport passport passport-local \
#     # @nestjs/jwt passport-jwt passport-google-oauth20 \
#     # @nestjs-modules/mailer nodemailer \
#     # bcrypt uuid winston nest-winston \
# 	# bad-words

#     # npm add -D @types/bcrypt @types/passport-google-oauth20 \
#     #     @types/passport-jwt @types/passport-jwt @types/passport-local

#     echo "NestJS project created"

#     sed -i 's/3000/4000/g' ./nest-project/src/main.ts
# fi

cd nest-project

echo "install npm package"
npm cache clean --force
npm install

# echo "check for update"
# npm update

echo "start server"
npm run start:dev
