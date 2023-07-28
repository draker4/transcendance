#!/bin/bash

#Go to the react project folder
echo "Creating folder for next project"

#If no react projet , create one
# if [ ! -d "/app" ]; then
#     echo "No next project found, creating one......."
    
#     #React + next.js
#     export CI=true
#     npx create-next-app transcendence --ts --src-dir

#     echo "Next project created"
# fi

#Install required depedencies
echo "install required depedencies"
cd /app
npm run clean
npm install

#Update required depedencies
# echo "update required depedencies"
# npm update

#Start dev env
echo "starting dev server"
npm run dev

#Start production
#npm run build && npm run start
