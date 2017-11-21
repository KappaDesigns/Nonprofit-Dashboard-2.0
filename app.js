// Express as application server framework
const Express = require('express');
const app = Express();

app.get('/', function handleRequest() {
	
});

// sets app to listen on a passed port.
app.listen(process.argv[2]);

