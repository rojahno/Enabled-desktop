import React from 'react';

import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import NavigationButtons from '../NavigationButtons';

afterEach(cleanup);
describe('Navigation buttons component', () => {
  test('Check the "navigate-next" button', () => {
    const canNavigateForward = false;
    const handleNextClick = jest.fn();
    const backNavigation = 'back';
    const { rerender } = render(
      <NavigationButtons
        canNavigateForward={canNavigateForward}
        handleNextClick={handleNextClick}
        backNavigation={backNavigation}
      />
    );
    //Checks if the next button is loaded.
    expect(screen.getByTestId('nextButton')).toBeInTheDocument();

    //Checks if the button is disabled
    expect(screen.getByTestId('nextButton')).toBeDisabled();

    // Re-renders the component with new props.
    rerender(
      <NavigationButtons
        canNavigateForward={true}
        handleNextClick={handleNextClick}
        backNavigation={backNavigation}
      />
    );
    //Checks if the button is enabled
    expect(screen.getByTestId('nextButton')).not.toBeDisabled();
  });

  test('Check the "navigate-back" button', () => {
    const canNavigateForward = false;
    const handleNextClick = jest.fn();
    const backNavigation = 'back';

    render(
      <NavigationButtons
        canNavigateForward={canNavigateForward}
        handleNextClick={handleNextClick}
        backNavigation={backNavigation}
      />
    );

    //Checks if the back button is loaded.
    const button = screen.getByTestId('backButton');
    expect(button).toBeInTheDocument();

    //Checks if the back button has "back" as the text
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
