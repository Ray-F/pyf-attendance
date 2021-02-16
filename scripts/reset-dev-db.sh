#!/bin/bash

MONGODB_URI_PROD=$1
MONGODB_URI_DEV=$2
CURRENT_DATE=$3

# Exit immediately on error
set -e

# Dump the current production database to a folder
printf "\n[SERVER] Running dump...\n"
mongodump --out="../db-dump-$CURRENT_DATE" --uri="$MONGODB_URI_PROD"

printf "\n[SERVER] Running restore...\n"
# Restore the dumped folder to the development database
mongorestore "../db-dump-$CURRENT_DATE" --uri="$MONGODB_URI_DEV" --nsFrom="pyf-attendance.*" --nsTo="pyf-attendance-dev.*" --drop

printf "\n[SERVER] Removing dump file...\n"
# Remove the dumped folder
rm -rf "../db-dump-$CURRENT_DATE"