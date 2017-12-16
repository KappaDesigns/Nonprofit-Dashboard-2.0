echo $1
./node_modules/.bin/eslint ./src/ ./tests
if [ $1 ];
	then
		./node_modules/mocha/bin/mocha tests/*.test.js --watch
else
	./node_modules/mocha/bin/mocha tests/*.test.js --exit
fi