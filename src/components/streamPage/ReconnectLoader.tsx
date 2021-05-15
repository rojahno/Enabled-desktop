import React from 'react';
import ReconnectLoaderDialog from './ReconnectLoaderDialog';

export interface ReconnectLoaderProps {
  open: boolean;
  seconds: number;
  handleCountDownReached: () => void;
}
/**
 * The reconnect loader component. Opens a dialog with a circular loading bar.
 */
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
