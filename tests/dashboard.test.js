require('./helpers/browser')();

const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow } = require('enzyme');
const { expect } = require('chai');

import Dashboard from '../src/app/src/components/Dashboard';
import TileContainer from '../src/app/src/components/Dashboard/TileContainer';

describe('<Dashboard/>', function () {
	it('Should have the correct tags in the component', () => {
		const wrapper = shallow(
			<Dashboard/>
		);
		expect(wrapper.find(TileContainer)).to.have.length(1);
	});
});