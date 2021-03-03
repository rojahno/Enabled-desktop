import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import VerticalLinearStepper from '../stepper'

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


export default function FrontPage(_props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SimplePaper>
        <h3>Add the IP of your phone</h3>
        <CustomInput />
        <CustomDialog />
        <Link to="/verification">
          <button>verification</button>
        </Link>
        <Link to="/main">
          <button>Main</button>
        </Link>
      </SimplePaper>
    </div>
  );
}
