import React from 'react';

import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { LoadingCircle } from '../LoadingCircle';
import LoadingCircleDialog from '../LoadingCircleDialog';

afterEach(cleanup);
describe(' Loading circle dialog component test', () => {
  test('Check if the Loading circle dialog is loading correctly', () => {
    const open = false;
    const delay = '0';
    const { rerender } = render(
      <LoadingCircleDialog open={open} />
    );

    //Checks if the loading cirlce is not loaded
    expect(screen.queryByTestId('loadingCircle')).not.toBeInTheDocument();

    // Re-renders the component with new props.
    rerender(<LoadingCircleDialog open={true} />);
    // Checks if the loading cirlce is loaded.
    expect(screen.getByTestId('loadingCircle')).toBeInTheDocument();
  });

});
