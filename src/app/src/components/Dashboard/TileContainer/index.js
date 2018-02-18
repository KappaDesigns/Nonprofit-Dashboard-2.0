import React from 'react';
import Tile from './Tile';
import PropTypes from 'prop-types';

import { StyleSheet, css } from 'aphrodite';

export default class TileContainer extends React.Component {
	constructor() {
		super();
		this.styles = StyleSheet.create({
			tileContainer: {
				display: 'flex',
				flexWrap: 'wrap',
			},
		});
	}

	render() {
		return (
			<div className={css(this.styles.tileContainer)}>
				{
					this.props.tiles.map((x, i) => {
						return (
							<Tile key={i} tile={x}/>
						);
					})
				}
			</div>
		);
	}
}

TileContainer.propTypes = {
	tiles: PropTypes.arrayOf(PropTypes.object),
};