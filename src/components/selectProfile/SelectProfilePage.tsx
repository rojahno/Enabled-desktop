import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: "100vh",
      display:'flex',
      justifyContent:'center',
      flexDirection:'row',
      alignItems:'center',
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
    container:{
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    
    }
  })
);

export default function SelectProfilePage(_props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Select profile</h3>
          
          <Link to="/">
            <button>back</button>
          </Link>
        </SimplePaper>
      </div>
    </div>
  );
}
