import React from 'react';
import TileContainer from './TileContainer';

import config from '../../../../../config';

export default class Dashboard extends React.Component {
	render() {
		return (
			<TileContainer tiles={config.tiles}>
			</TileContainer>
		);
	}
}