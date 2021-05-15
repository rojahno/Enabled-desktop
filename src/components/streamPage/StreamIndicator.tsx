import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

interface StreamIndicatorProps {
  isLive: boolean;
}
/**
 * The stream indicator component. Shows a green check mark if the isLive prop is true and a red cross if false.
 */
export default function StreamIndicator(props: StreamIndicatorProps) {
  const classes = useStyles();

  if (props.isLive) {
    return (
      <div>
        <h3  data-testid='liveStream' className={classes.container}>
          Stream is live
          <CheckBoxIcon style={{ color: green[500] }} />
        </h3>
      </div>
    );
  } else {
    return (
      <div>
        <h3 data-testid='downStream' className={classes.container}>
          Stream is down
          <ErrorIcon style={{ color: red[500] }} />
        </h3>
      </div>
    );
  }
}
