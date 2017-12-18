import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.css';

const App = (
	<h1 className="test">Hello, World!</h1>
);

ReactDOM.render(
	App,
	document.getElementById('app')
);


if (module.hot) {
	module.hot.accept();
}