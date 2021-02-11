#!/bin/bash

VERSION=$1

# Exit immediately if a command fails

if [[ "$VERSION" == "" ]]
then
  printf "\e[31m[SCRIPT] ERROR: No version argument sent to the script\e[0m\n"
  exit 1
fi

printf "\e[33m[SCRIPT] Updating project version to \e[1m$VERSION\e[0m\n"

PACKAGE_VERSION_STR="s/\"version\":.*/\"version\": \"$VERSION\",/"

# Update package.json in root directory
sed -i "" "$PACKAGE_VERSION_STR" package.json

# Update package.json in client and server directories
sed -i "" "$PACKAGE_VERSION_STR" client/package.json
sed -i "" "$PACKAGE_VERSION_STR" server/package.json

git add .
git commit -m "[BOT] Update project version to $VERSION"
git push origin dev

printf "\n\e[33m[SCRIPT] Tagging new version ($VERSION)...\e[0m\n"
git tag -a "$VERSION" -m ""
git push --tags

printf "\n\e[33m[SCRIPT] Merging to master...\e[0m\n"
git checkout master
git merge dev
git push origin master

# Return to development branch
git checkout dev


