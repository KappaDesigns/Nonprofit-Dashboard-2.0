import React from 'react';
import {
	BrowserRouter as Router,
	Route,
} from 'react-router-dom';

import ReactDOM from 'react-dom';

import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SiteEditor from './components/SiteEditor';

const App = (
	<div>
		<Router>
			<Layout>
				<Route exact path="/" component={Dashboard}/>
				<Route path="/editor" component={SiteEditor}/>
			</Layout>
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