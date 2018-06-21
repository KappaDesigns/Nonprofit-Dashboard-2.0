import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


import { StyleSheet, css } from 'aphrodite';

export default class NavLink extends React.Component {
	constructor() {
		super();
		this.styles = StyleSheet.create({
			navLink: {
				display: 'block',
			},
			navLinkText: {
				
			},
		});
	}

	render() {
		return (
			<Link className={css(this.styles.navLink)} to={this.props.page.path}>
				<li className={css(this.styles.navLinkText)}>{this.props.page.name}</li>
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