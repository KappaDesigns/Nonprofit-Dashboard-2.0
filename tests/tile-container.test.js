require('./helpers/browser')();

const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow } = require('enzyme');
const { expect } = require('chai');

import Dashboard from '../src/app/src/components/Dashboard';
import TileContainer from '../src/app/src/components/Dashboard/TileContainer';
import Tile from '../src/app/src/components/Dashboard/TileContainer/Tile';

const tiles = [
	{
		path: '/',
		name: 'dashboard',
	},
	{
		path: '/editor',
		name: 'editor',
	},
	{
		path: '/code',
		name: 'code',
	},
	{
		path: '/messages',
		name: 'messages',
	},
];

const config = require('../config');

describe('<TileContainer/>', () => {
	it('Should have the correct props', () => {
		const wrapper = shallow(
			<Dashboard/>
		);
		expect(wrapper.find(TileContainer).props().tiles).to.have.length(config.tiles.length);
	});

	it('Should render four Tiles', () => {
		const wrapper = shallow(
			<TileContainer tiles={tiles} />
		);
		expect(wrapper.find(Tile)).to.have.length(4);
	});

	it('Should have the correct elements', () => {
		const wrapper = shallow(
			<TileContainer tiles={tiles} />	
		);
		expect(wrapper.find('div')).to.have.length(1);
	});
});