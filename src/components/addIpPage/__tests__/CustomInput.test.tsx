import React from 'react';

import {
  render,
  cleanup,
  screen,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomInput from '../CustomInput';

afterEach(cleanup);

describe('test the custom input component', () => {
  test('The enter key beeing pressed', () => {
    const handleChange = jest.fn( (value) => {});
    const handleKeyPress = jest.fn();
    render(
      <CustomInput
        handleChange={handleChange}
        handleKeyPress={handleKeyPress}
      />
    );

    fireEvent.keyPress(screen.getByTestId('input'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: '13',
      charCode: '13',
    });

    expect(handleKeyPress).toHaveBeenCalledTimes(1);
  });
});
