import React from 'react';

import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CustomList from '../Cust../../utils/NavigationButtons

afterEach(cleanup);
describe('Custom list component', () => {
  test('Checks the list', () => {
    const handleListItemClick = jest.fn();
    const profiles = ['1', '2', '3', '4'];
    const selectedIndex = 0;
    const isLoading = false;
    render(
      <CustomList
        handleListItemClick={handleListItemClick}
        profiles={profiles}
        selectedIndex={selectedIndex}
        isLoading={isLoading}
      />
    );
    const list = screen.getByTestId('list');

    //Checks if the list is loaded
    expect(list).toBeInTheDocument();

    const listLenght = list.childElementCount;
    //Checks that the correct number of children are rendered.
    expect(listLenght).toBe(4);
  });

  test('Checks the loading circle', () => {
    const handleListItemClick = jest.fn();
    const profiles = ['1', '2', '3', '4'];
    const selectedIndex = 0;
    const isLoading = true;
    const { rerender } = render(
      <CustomList
        handleListItemClick={handleListItemClick}
        profiles={profiles}
        selectedIndex={selectedIndex}
        isLoading={isLoading}
      />
    );
    //Checks if the list is not loaded
    expect(screen.queryByTestId('list')).not.toBeInTheDocument();

    //Checks if the loading  circle is rendered
    expect(screen.getByTestId('loadingCircle')).toBeInTheDocument();

    // Re-renders the component with new props.
    rerender(
      <CustomList
        handleListItemClick={handleListItemClick}
        profiles={profiles}
        selectedIndex={selectedIndex}
        isLoading={false}
      />
    );
    //Checks if the loading  circle is removed after the re-render
    expect(screen.queryByTestId('loadingCircle')).not.toBeInTheDocument();
  });
});
