#!/bin/bash
echo "Begin NestJS configuration"

echo "Install required depedencies"
cd home
yarn global add node-gyp
yarn cache clean
yarn install --check-files

echo "Update depedencies"
yarn upgrade

#Start dev env
echo "Starting dev frontend environment"
yarn run start:dev:backend

#Start prod env
#echo "Starting prod frontend environment"
#yarn run start:prod:backend

