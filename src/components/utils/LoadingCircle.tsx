import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingCircle: {
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
    progressBarColor: {
      color: '#3c3c3c',
    },
  })
);

interface LoadingCircleProps {
  loading: boolean;
  delay: string;
  color:string,
}
/**
 * The loading circle component. Shows a loading circle if the loading prop is true.
 */
const LoadingCircle = (props: LoadingCircleProps) => {
  const classes = useStyles();

  return (
    <div className={classes.loadingCircle}>
      <Fade
        in={props.loading}
        style={{
          transitionDelay: props.loading ? props.delay : '0ms',
        }}
        unmountOnExit
      >
        <CircularProgress
          data-testid="loadingCircle"
         style={{color:props.color}}
        />
      </Fade>
    </div>
  );
};

export { LoadingCircle };
