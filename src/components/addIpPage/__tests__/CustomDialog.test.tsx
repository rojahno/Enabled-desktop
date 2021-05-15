import React from 'react';
import CustomDialog from './../CustomDialog';

import {
  render,
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test('modal shows the children and close button', async () => {
  render(<CustomDialog />);

  //Checks that the link element exists.
  expect(screen.getByText('Find ip address')).toBeTruthy();

  //Checks that the modal dialog is not loaded before the link is clicked.
  const title = screen.queryByText('How to find ip');
  expect(title).not.toBeInTheDocument();

  //Fires the click event which opens the dialog.
  userEvent.click(screen.getByText('Find ip address'));

  //Checks if the modal dialog title window is loaded
  expect(screen.getByText('How to find ip')).toBeTruthy();

  //Checks if the ok button is loaded.
  expect(screen.getByText('ok')).toBeTruthy();

  //Fires the click event which closes the dialog.
  userEvent.click(screen.getByText('ok'));

  //Checks if the modal dialog title window has been removed.
  await waitForElementToBeRemoved(() => screen.queryByText('How to find ip'));
});


