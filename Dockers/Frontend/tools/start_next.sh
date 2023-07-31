#!/bin/bash
echo "Begin Next configuration"

echo "Install required depedencies"
cd home
yarn global add node-gyp
yarn cache clean
yarn install --check-files

echo "Update depedencies"
yarn upgrade

#Start dev env
echo "Starting dev frontend environment"
yarn run start:dev:frontend

#Start prod env
#echo "Starting prod frontend environment"
#yarn run start:prod:frontend
