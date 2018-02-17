npm i
./scripts/heroku.sh
node ./scripts/cloneSite
cd ./site/
git pull
cd ..
npm run document