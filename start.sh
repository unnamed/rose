#!/usr/bin/env sh

##
## Script used to start the bot using
## Deno, the script also adds some
## necessary flags to run the bot
##
deno run --allow-env --allow-read --allow-net mod.ts
