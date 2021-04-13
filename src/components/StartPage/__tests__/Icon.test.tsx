import React from 'react';

import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SuccessIcon from '../Icon';

// Check error beeing cast by this test.
afterEach(cleanup);
describe('tests the successIcon component', () => {
  test('check the conditional rendering', () => {
    const hasError = false;
    const label = 'Hello';
    // const { rerender } = render(
    // <SuccessIcon hasError={hasError} label={label} />
    // );

    // //Checks if the conditional rendering was successful
    // expect(screen.getByTestId('SuccessIcon')).toBeInTheDocument();
    
    // rerender(
    // <SuccessIcon hasError={true} label={label} />
    // )
    //     //Checks if the conditional rendering was successful
    //     expect(screen.getByTestId('failure')).toBeInTheDocument();

  });
});
