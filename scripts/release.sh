#!/bin/bash

VERSION=$1

# Exit immediately if a command fails
set -e

if [[ "$VERSION" == "" ]]
then
  printf "[SCRIPT] ERROR: No version argument sent to the script\n"
  exit 1
fi

printf "[SCRIPT] Updating project version to \e[1m$VERSION\e[0m\n"

PACKAGE_VERSION_STR="s/\"version\":.*/\"version\": \"$VERSION\",/"

# Update package.json in root directory
sed -i "" "$PACKAGE_VERSION_STR" package.json

# Update package.json in client and server directories
sed -i "" "$PACKAGE_VERSION_STR" client/package.json
sed -i "" "$PACKAGE_VERSION_STR" server/package.json

git add .
git commit -m "[SCRIPT] Update project version to $VERSION"
git push origin dev

printf "\n[SCRIPT] Tagging new version ($VERSION)...\n"
git tag -a $VERSION -m ""
git push --tags

printf "\n[SCRIPT] Merging to master...\n"
git checkout master
git merge dev
git push origin master

# Return to development branch
git checkout dev


