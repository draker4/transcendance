#!/bin/bash

#Go to the react project folder
echo "Creating folder for react project"
mkdir -p /app

#If no react projet , create one
if [ ! -d "/app/node_modules" ]; then
    echo "No react project found, creating one..."
    npx create-react-app app/transcendence-app
    echo "React project created"
fi

#Start react project
echo "Starting react project"
cd app/transcendence-app
npm start
