import React from 'react';
import PropTypes from 'prop-types';

export default class TileIcon extends React.Component {
	render() {
		return (
			<i className={`tile-icon fas fa-${this.props.icon.name} fa-${this.props.icon.size}x`}></i>
		);
	}
}

TileIcon.propTypes = {
	icon: PropTypes.shape({
		size: PropTypes.number,
		name: PropTypes.string,
	}),
};