require('./helpers/browser')();

const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow } = require('enzyme');
const { expect } = require('chai');

import TileIcon from '../src/app/src/components/Dashboard/TileContainer/Tile/TileIcon';
import Tile from '../src/app/src/components/Dashboard/TileContainer/Tile';

const icon = {
	name: 'home',
	size: 4,
};

const tile = {
	path: '/',
	name: 'dashboard',
	color: 'red',
	icon: icon,
};

describe('<TileIcon />', () => {
	it('Should have the correct elements', () => {
		const wrapper = shallow(
			<TileIcon icon={icon}/>
		);
		expect(wrapper.find('i')).to.have.length(1);
	});

	it('Should have the correct props', () => {
		const wrapper = shallow(
			<Tile tile={tile}/>
		);
		expect(wrapper.find(TileIcon).props().icon).to.haveOwnProperty('name');
		expect(wrapper.find(TileIcon).props().icon).to.haveOwnProperty('size');
	});
});