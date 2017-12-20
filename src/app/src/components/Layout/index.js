import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';

export default class Layout extends React.Component {
	render() {
		return (
			<div>
				<Navbar />
				{ this.props.children }
			</div>
		);
	}
}

Layout.propTypes = {
	children: PropTypes.node,
};