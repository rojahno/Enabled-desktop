import React from 'react';

import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StreamIndicator from '../StreamIndicator';

afterEach(cleanup);

test('the streamindicator props', async () => {
  const { rerender } = render(<StreamIndicator isLive={true} />);

  //Checks that the H3 element exists.
  expect(screen.queryByTestId('liveStream')).toBeInTheDocument();
  //Checks that the h3 element doesn't exists.
  expect(screen.queryByTestId('downStream')).not.toBeInTheDocument();

  rerender(<StreamIndicator isLive={false} />);
  //Checks that the H3 element exists.
  expect(screen.queryByTestId('downStream')).toBeInTheDocument();
  //Checks that the h3 element doesn't exists.
  expect(screen.queryByTestId('liveStream')).not.toBeInTheDocument();
});
