#!/bin/bash

MONGODB_URI_PROD=$1
CURRENT_DATE=$2

# Exit immediately on error
set -e

# Dump the current production database to a folder
printf "\n[SERVER] Running dump...\n"
mongodump --forceTableScan --out="db-dump-$CURRENT_DATE" --uri="$MONGODB_URI_PROD"
