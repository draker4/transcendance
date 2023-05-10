#!/bin/bash

#If no react projet , create one
if [ ! -d "/app/node_modules" ]; then
    echo "No react project found, creating one..."
    npx create-react-app transcendence-app
    echo "React project created"
fi