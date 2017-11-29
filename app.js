// Express as application server framework
const Express = require('express');
const app = Express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./src/routes'));

// sets app to listen on a passed port.
app.listen(process.argv[2] || 8080, function () {
	console.log('Listenting on port 8080');
});

//https://github.com/gothinkster/node-express-realworld-example-app/blob/master/app.js