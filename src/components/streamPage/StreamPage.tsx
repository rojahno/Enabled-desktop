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
  const [ip, setIp] = useState('');

  useEffect(() => {
    let ip: string = props.location.state.ipAdress;
    setIp(ip);
    let mobileDriver: MobileDriver = MobileDriver.getInstance();
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
          <p>{'Connected to: ' + ip} </p>

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
