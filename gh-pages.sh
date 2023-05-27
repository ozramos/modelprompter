#!/usr/bin/env sh

# abort on errors
set -e

cd dist/spa

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:handsfreejs/handsfree.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git remote add origin https://github.com/ozramos/modelprompter
# git push -f origin gh-pages
git push -f git@github.com:ozramos/modelprompter.git master:gh-pages

cd -
