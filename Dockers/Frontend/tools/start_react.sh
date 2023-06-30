#!/bin/bash

#Go to the react project folder
echo "Creating folder for react project"
mkdir -p /app
cd /app

#If no react projet , create one
if [ ! -d "/app/transcendence" ]; then
    echo "No next project found, creating one......."
    
    #React + next.js
    export CI=true
    npx create-next-app transcendence --ts --src-dir

    echo "Next project created"
fi

#Start react project
echo "Starting react project"
# chmod -R 777 transcendence
cd transcendence

echo "install required depedencies"
npm install
#echo "update required depedencies"
#npm update

#As dev
echo "starting dev server"
npm run dev

#As prod
#npm run build && npm run start
