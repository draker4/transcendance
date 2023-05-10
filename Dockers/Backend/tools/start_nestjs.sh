#!/bin/bash

echo "Begin NestJS configuration"
mkdir -p 

#If no react projet , create one
if [ ! -d "/app/node_modules" ]; then
    echo "No NestJS project found, creating one..."
    nest new nest-project
    echo "NestJS project created"
fi

cd nest-project

npm run start:dev
