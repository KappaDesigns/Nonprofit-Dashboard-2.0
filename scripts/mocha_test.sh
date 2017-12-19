echo $1
./node_modules/.bin/eslint ./src/lib ./src/app/src/ ./src/routes/ ./src/util/ ./tests
if [ $1 ];
	then
		./node_modules/mocha/bin/mocha tests/*.test.js --compilers js:babel-core/register --watch
else
	./node_modules/mocha/bin/mocha tests/*.test.js --compilers js:babel-core/register --exit
fi