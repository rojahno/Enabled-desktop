import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
    paper: {
      margin: theme.spacing(3),
      width: theme.spacing(50),
      height: theme.spacing(50),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"#ffffffaa"
    },
  })
);

export default function SimplePaper(_props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={10}>
        {_props.children}
      </Paper>
    </div>
  );
}
