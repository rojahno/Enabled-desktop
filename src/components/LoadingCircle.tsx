import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';


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
  })
);

const LoadingCircle =(load: boolean)=> {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('idle');
  const timerRef = useRef<number>();

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },[]
  );

  const handleClickLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  const handleClickQuery = () => {
    clearTimeout(timerRef.current);

    if (query !== 'idle') {
      setQuery('idle');
      return;
    }

    setQuery('progress');
    timerRef.current = window.setTimeout(() => {
      setQuery('success');
    }, 2000);
  };

  return (
    <div className={classes.root}>
        {query === 'success' ? (
          <Typography>Success!</Typography>) : (
          <Fade
            in={query === 'progress'}
            style={{transitionDelay: query === 'progress' ? '800ms' : '0ms' }}
            unmountOnExit>
            <CircularProgress />
          </Fade>
        )}
      <Button onClick={handleClickQuery} className={classes.button}>
        {query !== 'idle' ? 'Reset' : 'Simulate a load'}
      </Button>
    </div>
  );
}

export default {LoadingCircle};
