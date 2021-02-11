#!/bin/bash

# IMPORTANT: This script should only be run on the server environment!

# Make master branch up to date with master
git fetch
git reset origin/master --hard
git checkout master
git pull

# Build client and move to the right directory
cd ../client && yarn run build
rm -r build-latest
mv build build-latest

