import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
const useStyles = makeStyles((theme: Theme) =>
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

export default function StreamIndicator(props: StreamIndicatorProps) {
  const classes = useStyles();

  if (props.isLive) {
    return (
      <div>
        <h3 className={classes.container}>
          Stream is live
          <CheckBoxIcon style={{ color: green[500] }} />
        </h3>
      </div>
    );
  } else {
    return (
      <div>
        <h3 className={classes.container}>
          Stream is down
          <ErrorIcon style={{ color: red[500] }} />
        </h3>
      </div>
    );
  }
}
