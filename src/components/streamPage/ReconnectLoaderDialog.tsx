import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { useState } from 'react';
import { LoadingCircle } from '../utils/LoadingCircle';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContainer: {
      backgroundColor: 'transparent',
      boxShadow: '0',
      overflow: 'hidden',
    },
    paper: {
      margin: theme.spacing(4),
      width: theme.spacing(25),
      height: theme.spacing(25),
      backgroundColor: '#3c3c3caa',
      color: '#ffffffaa',
    },
    container: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
    },
  })
);

export interface ReconnectLoaderProps {
  open: boolean;
  seconds: number;
  handleCountDownReached: () => void;
}
/**
 * The reconnect loader. Shows a circular loading bar and counts down from 60.
 */
export default function ReconnectLoader(props: ReconnectLoaderProps) {
  const classes = useStyles();
  const [secondsLeft, setSecondsLeft] = useState(props.seconds);

  const handleClose = () => {};

  useEffect(() => {
    const interval = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft((secondsLeft) => secondsLeft - 1);
      } else {
        clearInterval(interval);
        props.handleCountDownReached();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  return (
    <Dialog
      className={classes.dialogContainer}
      aria-labelledby=""
      open={props.open}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
        },
      }}
    >
      <Paper className={classes.paper}>
        <div className={classes.container}>
          <p className={classes.title}>Reconnecting</p>
          <p>{secondsLeft}</p>
          <LoadingCircle loading={true} delay={'0ms'} color={'#ffffff'} />
          <button onClick={props.handleCountDownReached}>Cancel</button>
        </div>
      </Paper>
    </Dialog>
  );
}
