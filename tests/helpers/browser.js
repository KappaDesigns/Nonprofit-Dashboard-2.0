module.exports = function(markup) {
	if (typeof document !== 'undefined') return;
	var jsdom = require('jsdom');
	const { JSDOM } = jsdom;
	global.document = new JSDOM(markup || '');
	global.window = document.parentWindow;
	global.navigator = {
		userAgent: 'node.js',
	};
};