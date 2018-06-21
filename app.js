// Express as application server framework
const Express = require('express');
const app = Express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

const WebpackConfig = require('./webpack.dev');
const Webpack = require('webpack');
const WebpackMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');

const WebpackCompiler = Webpack(WebpackConfig);
const PUBLIC_PATH = path.join(__dirname, '/src/app/build/');

const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (isProduction) {
	app.use('*', Express.static(PUBLIC_PATH));
} else {
	app.use(WebpackMiddleware(WebpackCompiler, {
		publicPath: WebpackConfig.output.publicPath,
		stats: {
			colors: true,
		},
	}));

	app.use(WebpackHotMiddleware(WebpackCompiler, {
		log: console.log,
	}));
}

app.use(session({ 
	secret: 'conduit',
	cookie: { maxAge: 60000 }, 
	resave: false, 
	saveUninitialized: false,
}));

app.use(require('./src/routes'));

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (!isProduction) {
	app.use(function(err, req, res) {
		console.log(err.stack);  
		res.status(err.status || 500);  
		res.json({'errors': {
			message: err.message,
			error: err,
		}});
	});
}

app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.json({'errors': {
		message: err.message,
		error: {},
	}});
});

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
