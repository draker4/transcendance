#!/bin/bash

#Go to the react project folder
echo "Creating folder for react project"
mkdir -p /app
chmod -R 777 /app
cd /app

#If no react projet , create one
if [ ! -d "/app/transcendence-app" ]; then
    echo "No next project found, creating one......."

    #React only
    #npx create-react-app app/transcendence-app
    
    #React + next.js
    export CI=true
    npx create-next-app transcendence-app --ts --src-dir
    npm add jose nanoid
    echo "Next project created"
fi

#Start react project
echo "Starting react project"
chmod -R 777 transcendence-app
cd transcendence-app

echo "install required depedencies"
npm install

#As dev
npm run dev

#As prod
# npm run build && npm run start
