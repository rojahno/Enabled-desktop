import React from 'react';

import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { LoadingCircle } from '../LoadingCircle';

afterEach(cleanup);
describe(' Loading circle component test', () => {
  test('Check if the Loading circle is loading', () => {
    const loading = false;
    const delay = '0';
    const { rerender } = render(
      <LoadingCircle loading={loading} delay={delay} />
    );

    //Checks if the loading cirlce is not loaded
    expect(screen.queryByTestId('loadingCircle')).not.toBeInTheDocument();

    // Re-renders the component with new props.
    rerender(<LoadingCircle loading={true} delay={delay} />);
    // Checks if the loading cirlce is loaded.
    expect(screen.getByTestId('loadingCircle')).toBeInTheDocument();
  });

});
