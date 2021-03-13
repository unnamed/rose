#!/usr/bin/env sh

##
## Create the .env file from the
## .env.template file
##
if ! [ -f "./.env" ]; then
  echo "################################"
  echo "## '.env' file doesn't exists ##"
  echo "## creating an empty '.env'   ##"
  echo "################################"

  # Copy the file
  cp .env.template .env
  echo "" # Just a separator

  echo "####################################"
  echo "## A new '.env' file was created, ##"
  echo "## please fill its properties and ##"
  echo "## re-run this script             ##"
  echo "####################################"
  exit 0
fi

##
## Script used to start the bot using
## Deno, the script also adds some
## necessary flags to run the bot
##
deno run --allow-env --allow-read --allow-net --unstable mod.ts
