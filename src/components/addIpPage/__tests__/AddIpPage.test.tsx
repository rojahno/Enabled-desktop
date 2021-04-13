import React from 'react';

import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomInput from '../CustomInput';
import AddIpPage from '../AddIpPage';

afterEach(cleanup);
describe('test the add ip page', () => {
  test('the loading circle', () => {
    const handleChange = jest.fn();
    const handleKeyPress = jest.fn();
    const handleNextClick = jest.fn();
    const ipAdress = '127.1.0.1';
    const validIpAdress = false;
    const openLoadingCircle = false;

    const { rerender } = render(
      <AddIpPage
        handleChange={handleChange}
        handleKeyPress={handleKeyPress}
        ipAdress={ipAdress}
        validIpAdress={validIpAdress}
        handleNextClick={handleNextClick}
        openLoadingCircle={openLoadingCircle}
      />
    );

  });
});
