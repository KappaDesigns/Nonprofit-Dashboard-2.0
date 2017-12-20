import React from 'react';
import NavLink from './NavLink';
import PropTypes from 'prop-types';

export default class Navbar extends React.Component {
	render() {
		return (
			<ul>
				<li>{this.props.site}</li>
				{
					this.props.pages.map((page, i) => {
						return <NavLink page={page} key={i} />;
					})
				}
			</ul>
		);
	}
}

Navbar.propTypes = {
	pages: PropTypes.array,
	site: PropTypes.string,
};
