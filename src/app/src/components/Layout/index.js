import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';

import config from '../../../../../config.json';

export default class Layout extends React.Component {
	render() {
		return (
			<div className="layout-container">
				<Navbar site={config.site} pages={config.pages} />
				{ this.props.children }
			</div>
		);
	}
}

Layout.propTypes = {
	children: PropTypes.node,
};