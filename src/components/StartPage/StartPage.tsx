import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import VerticalLinearStepper from '../stepper'
import Button from '@material-ui/core/Button'

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
      backgroundColor: '#ffffff95',
    },
    })
);

export default function StartPage(_props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
         <div className="frontpage-container">
         <VerticalLinearStepper/>
      <SimplePaper>
        <Link to = '/select'>
        <Button variant="contained">Default</Button>
        </Link>
      </SimplePaper>
         </div>
    </div>
  );
}
