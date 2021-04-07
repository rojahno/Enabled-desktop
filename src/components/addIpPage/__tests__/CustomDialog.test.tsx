import React from 'react';
import ReactDOM from 'react-dom';
import CustomDialog from './../CustomDialog';

import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import CustomInput from '../customInput';

afterEach(cleanup);

it('renders custom dialog without crashing', () => {
    const {getByTestId} = render(<CustomDialog/>);
  const root = document.createElement('div');
  ReactDOM.render(<CustomDialog />, root);

});
