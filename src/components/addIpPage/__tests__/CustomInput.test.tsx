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

    //fires the enter key press event.
    fireEvent.keyPress(screen.getByTestId('input'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: '13',
      charCode: '13',
    });
    //checks if the keypress event has been fired one time
    expect(handleKeyPress).toHaveBeenCalledTimes(1);
  });

  test('The users is able to write in the textfield', () => {
    const handleChange = jest.fn( (value) => {});
    const handleKeyPress = jest.fn();
    render(
      <CustomInput
        handleChange={handleChange}
        handleKeyPress={handleKeyPress}
      />
    );

    const input = screen.getByRole('textbox', {name: ""});
    //Checks if the textfield is loaded in the document
    expect(input).toBeInTheDocument();

    //Changes the value of the textfield
    fireEvent.change(input, { target: { value: '1.0.0.1' } })
    //Checks if the value is changed
    expect(input).toHaveValue('1.0.0.1');

    //Changes the value of the textfield
    fireEvent.change(input, { target: { value: '' } })
    expect(input).toHaveValue('');

  });

});
