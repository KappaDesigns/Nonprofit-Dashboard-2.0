import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.css';

import Icon from './imgs/test.jpg';

const App = (
	<h1 className="test">Hello, world!</h1>
);

let elem = document.createElement('div');
const img = new Image();
img.src = '/build/' + Icon;
elem.appendChild(img);
document.body.appendChild(elem);


ReactDOM.render(
	App,
	document.getElementById('app')
);