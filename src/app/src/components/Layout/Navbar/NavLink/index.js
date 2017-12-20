import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class NavLink extends React.Component {
	render() {
		return (
			<Link to={this.props.page.path}>
				<li>{this.props.page.name}</li>
			</Link>
		);
	}
}

NavLink.propTypes = {
	page: PropTypes.shape({
		name: PropTypes.string,
		path: PropTypes.string,
	}),
};