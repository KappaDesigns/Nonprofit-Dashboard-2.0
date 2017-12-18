import React from 'react';
import { 
	BrowserRouter as Router,
	Route,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Dashboard from './pages/Dashboard';

const App = (
	<Router>
		<Route path='/' component={Dashboard}/>
	</Router>
);

ReactDOM.render(
	App,
	document.getElementById('app')
);

if (module.hot) {
	module.hot.accept();
}