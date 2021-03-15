import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { CortexDriver } from '../../modules/CortexDriver';
import { Link } from 'react-router-dom';
import { MobileDriver } from '../../modules/MobileDriver';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
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
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems:'flex-end',
      width: '100%',
      height:'100%',
      padding: '3px',
    },
  })
);

export default function StreamPage(props: any) {
  const classes = useStyles();
  const [streamCommand, setStreamCommand] = useState('');

  useEffect(() => {
    let ip: string = props.location.state.ipAdress;
    let mobileDriver: MobileDriver = MobileDriver.getInstance();
    //mobileDriver.startSocket(ip);
    let driver: CortexDriver = CortexDriver.getInstance();
    const offLoad = () => {
      driver.stopStream();
      mobileDriver.closeSocket();
    };

    return() => offLoad();
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Stream:</h3>
          <p>{streamCommand} </p>

          <div className={classes.buttons}>
            <Link to="/ip">
              <button>Back</button>
            </Link>
          </div>
        </SimplePaper>
      </div>
    </div>
  );
}
