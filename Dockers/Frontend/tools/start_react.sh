#!/bin/bash

#Go to the react project folder
echo "Creating folder for react project"
mkdir -p /app
chmod -R 777 /app
cd /app

#If no react projet , create one
if [ ! -d "/app/transcendence-app" ]; then
    echo "No react project found, creating one......."

    #React + next.js
    export CI=true
    npx create-next-app transcendence-app --ts --src-dir
    echo "React project created"
fi

#Start react project
echo "Starting react project"
chmod -R 777 transcendence-app
cd transcendence-app

#As dev
npm run dev

#As prod
# npm run build && npm run start
