import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Styles from '../../../../styles';

import { css } from 'aphrodite';

export default class NavLink extends React.Component {
	render() {
		return (
			<Link className={css(Styles.navLink)} to={this.props.page.path}>
				<li className={css(Styles.navLinkText)}>{this.props.page.name}</li>
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