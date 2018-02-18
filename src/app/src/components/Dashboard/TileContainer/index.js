import React from 'react';
import Tile from './Tile';
import PropTypes from 'prop-types';

export default class TileContainer extends React.Component {
	render() {
		return (
			<div className="tile-container">
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