// Express as application server framework
const Express = require('express');
const app = Express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./src/routes'));

// sets app to listen on a passed port.
app.listen(process.env.PORT || process.argv[2] || 8080, function () {
	let port = 8080;
	if (process.env.PORT) {
		port = process.env.PORT;
	} else if (process.argv[2]) {
		port = process.argv[2];
	}
	console.log('Server is listening on port: ' + port);
});

//https://github.com/gothinkster/node-express-realworld-example-app/blob/master/app.js