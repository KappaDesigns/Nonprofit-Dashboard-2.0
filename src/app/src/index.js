import React from 'react';
import {
	BrowserRouter as Router,
	Route,
} from 'react-router-dom';

import { Link } from 'react-router-dom';

import ReactDOM from 'react-dom';

import Dashboard from './pages/Dashboard';
import SiteEditor from './pages/SiteEditor';

const App = (
	<div>
		<Router>
			<div>
				<Route path="/" component={Dashboard}/>
				<Route path="/editor" component={SiteEditor}/>
			</div>
		</Router>
	</div>
);

ReactDOM.render(
	App,
	document.getElementById('app')
);

if (module.hot) {
	module.hot.accept();
}