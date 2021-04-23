import React from 'react';

import ReconnectLoaderDialog from './ReconnectLoaderDialog';

export interface ReconnectLoaderProps {
  open: boolean;
  seconds: number;
  handleCountDownReached: () => void;
}

export default function ReconnectLoader(props: ReconnectLoaderProps) {
  if (props.open) {
    return (
      <ReconnectLoaderDialog
        open={props.open}
        handleCountDownReached={props.handleCountDownReached}
        seconds={props.seconds}
      />
    );
  } else {
    return <div />;
  }
}
