#!/bin/bash

echo "Begin NestJS configuration"

mkdir -p nest-project
chmod -R 755 nest-project/

#If no react projet , create one
if [ ! -d "./nest-project/node_modules" ]; then
    echo "No NestJS project found, creating one..."
    nest new nest-project --package-manager npm
    echo "NestJS project created"
fi

cd nest-project

npm run start:dev
