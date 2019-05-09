#!/bin/sh

APP_PATH=/usr/src/app
TEMP_FOLDER=$(mktemp -d)
ADONIS_BRANCH=master
ADONIS_REPOSITORY=adonis-"$ADONIS_SCAFFOLD"-app
ADONIS_REPOSITORY_URL=https://github.com/adonisjs/"$ADONIS_REPOSITORY"/archive/"$ADONIS_BRANCH".zip
ADONIS_FRESH_APP_FOLDER="$TEMP_FOLDER"/"$ADONIS_REPOSITORY"-"$ADONIS_BRANCH"

set -e

   if [ ! -f "package.json" ]; then
       echo "package.json not found, check if you're copying you project in $APP_PATH"

       if [ ! -z "$ADONIS_SCAFFOLD" ] || [ "$ADONIS_SCAFFOLD" = "api" ] || [ "$ADONIS_SCAFFOLD" = "slim" ] || [ "$ADONIS_SCAFFOLD" = "fullstack" ]; then
           
           echo "Downloading fresh Adonis $ADONIS_SCAFFOLD project."

           cd "$TEMP_FOLDER" || exit 1
           
           #Download and Unzip the last stable adonis app
           wget "$ADONIS_REPOSITORY_URL" -q && \
           unzip -d . -q master.zip && rm -rf "$ADONIS_BRANCH".zip 2> /dev/null
            
           #Install dependencies, make a .env and generate a key
           cd "$ADONIS_FRESH_APP_FOLDER" && \
           cp .env.example .env && adonis key:generate

           #Move the fresh install to app folder and clean
           cd "$APP_PATH" || exit 1 && \
           mv "$ADONIS_FRESH_APP_FOLDER"/* "$APP_PATH" 2> /dev/null && \
           mv "$ADONIS_FRESH_APP_FOLDER"/.* "$APP_PATH" 2> /dev/null && \
           rm -rf "$TEMP_FOLDER" 2> /dev/null
           
       else
           echo "ADONIS SCAFFOLD wasn't set or is incorrect, neither project will be downloaded. exiting."
           exit 1
       fi
   else
       if [ ! -f ".env" ]; then
           echo "Please create a .env file first. exiting."
           exit 1
       fi
   fi

   sed -i -e "s/^HOST=.*/HOST=0.0.0.0/; s/^PORT=.*/PORT=3333/" .env

   #Check if project dependencies exist
   if [ ! -d npm_modules ] || [ -e npm_modules ]; then
        npm install
   fi

   #start server
   node server.js

exec "$@"