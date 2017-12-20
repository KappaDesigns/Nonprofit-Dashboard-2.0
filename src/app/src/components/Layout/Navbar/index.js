import React from 'react';
import config from '../../../../../../config.json';
import NavLink from './NavLink';

export default class Navbar extends React.Component {
	render() {
		return (
			<ul>
				{
					config.pages.map((page, i) => {
						return <NavLink page={page} key={i} />;
					})
				}
			</ul>
		);
	}
}
