import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      margin: theme.spacing(2),
    },
    placeholder: {
      height: 40,
    },
    progressBarColor:{
      color:'#3c3c3c',
    }
  })
);

interface LoadingCircleProps {
  loading: boolean;
  delay:string;
}

const LoadingCircle = (props: LoadingCircleProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fade
        in={props.loading}
        style={{
          transitionDelay: props.loading ? props.delay : '0ms',
        }}
        unmountOnExit
      >
        <CircularProgress 
        data-testid="loadingCircle"
        classes={{
          colorPrimary: classes.progressBarColor
        }} />
      </Fade>
    </div>
  );
};

export { LoadingCircle };
