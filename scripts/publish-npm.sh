#!/usr/bin/env bash

# Before you run this script, do this:
# 1) Update the version in package.json
# 4) Commit to the master branch.

# Then:
# 5) Checkout the master branch of this repo.
# 6) Run this script as `./scripts/publish-npm.sh` from the project base dir.

set -e

BRANCH=`git rev-parse --abbrev-ref HEAD`
ORIGIN=`git config --get remote.origin.url`

if [ "$BRANCH" != "master" ]; then
  echo "Error: Switch to the master branch before publishing."
  exit 1
fi

if ! [[ "$ORIGIN" =~ ^https://github.com/PeculiarVentures/GammaCV ]]; then
  echo "Error: Switch to the main repo (PeculiarVentures/GammaCV) before publishing."
  exit 1
fi

npm publish
echo 'Published a new package to npm.'