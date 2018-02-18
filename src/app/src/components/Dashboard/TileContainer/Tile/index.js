import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import TileIcon from './TileIcon';

import { StyleSheet, css } from 'aphrodite';

export default class Tile extends React.Component {
	constructor(props) {
		super();
		this.styles = StyleSheet.create({
			tile: {
				margin: '25px',
				display: 'block',
				width: '250px',
				height: '350px',
				backgroundColor: props.tile.color,
				color: 'black',
				textAlign: 'center',
				textDecoration: 'none',
				textTransform: 'capitalize',
			},
			tileName: {
				fontSize: '36px',
				padding: '20px',
			},
		});
	}

	render() {
		return (
			<Link to={this.props.tile.path} className={css(this.styles.tile)}>
				<h1 className={css(this.styles.tileName)}>{this.props.tile.name}</h1>
				<TileIcon icon={this.props.tile.icon}/>
			</Link>
		);
	}
}

Tile.propTypes = {
	tile: PropTypes.shape({
		name: PropTypes.string,
		path: PropTypes.string,
		color: PropTypes.string,
		icon: PropTypes.shape({
			size: PropTypes.number,
			name: PropTypes.string,
		}),
	}),
};