#!/bin/bash
echo "Begin Next configuration"

cd home
yarn global add node-gyp
# Check if node_modules folder exists
if [ -d "node_modules" ]; then
  # echo "Update dependencies"
  # cd workspaces/Frontend
  # yarn cache clean
  # yarn upgrade --latest --exact
  # cd ../..
  echo "already installed"
  yarn cache clean
  yarn install
else
  echo "Install required dependencies"
  yarn install
fi

#Start dev env
# echo "Starting dev frontend environment"
# yarn run start:dev:frontend

#Start prod env
echo "Starting prod frontend environment"
yarn run start:prod:frontend
