// Express as application server framework
const Express = require('express');
const app = Express();

//Handling pages task
// 0. init by passing git clone url
// 1. download website
// 2. check every 24 hours and pull down the website
// 3. edits to the site written to the file in the local git repo

app.get('/', function handleRequest() {
	
});

// sets app to listen on a passed port.
app.listen(process.argv[2]);