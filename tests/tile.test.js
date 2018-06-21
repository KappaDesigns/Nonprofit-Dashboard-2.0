require('./helpers/browser')();

const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow } = require('enzyme');
const { expect } = require('chai');

// const config = require('../config');

import TileIcon from '../src/app/src/components/Dashboard/TileContainer/Tile/TileIcon';
import { Link } from 'react-router-dom';
import Tile from '../src/app/src/components/Dashboard/TileContainer/Tile';
import TileContainer from '../src/app/src/components/Dashboard/TileContainer';

const tile = {
	path: '/',
	name: 'dashboard',
	color: 'red',
	icon: {
		size: 3,
		icon: 'home',
	},
};

describe('<Tile/>', () => {
	it('Should check the have the correct elements', () => {
		const wrapper = shallow(
			<Tile tile={tile}/>
		);
		expect(wrapper.find(Link)).to.have.length(1, 'missing link');
		expect(wrapper.find('h1')).to.have.length(1, 'missing h1');
		expect(wrapper.find(TileIcon)).to.have.length(1, 'missing tile icon');
	});

	it('Should have the correct props', () => {
		const wrapper = shallow(
			<TileContainer tiles={[tile]}/>
		);
		expect(Object.keys(wrapper.find(Tile).props().tile)).to.have.length(4);
	});
});