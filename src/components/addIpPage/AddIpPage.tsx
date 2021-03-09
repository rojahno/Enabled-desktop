import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import { CortexDriver } from '../../modules/CortexDriver';
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
      justifyContent: 'space-between',
      width: '100%',
      padding: '3px',
    },
  })
);

const hasValidIPaddress = (ipAdress: string) => {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipAdress
    )
  ) {
    return true;
  }
  alert('You have entered an invalid IP address!');
  return false;
};

export default function AddIpPage(_props: any) {
  const classes = useStyles();
  const [ipAdress, setIpAdress] = useState('No input');
  const [validIpAdress, setValidIpAdress] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('here');
    setIpAdress(event.target.value);
  };

  const handleNextClick = async () => {
    try {
      let driver: CortexDriver = CortexDriver.getInstance();
      let authoken: string = await driver.authorize();
      let headsetId: string = await driver.queryHeadsetId();
      let hasLoadedProfile = await driver.hasCurrentProfile(
        authoken,
        headsetId
      );

      if (hasLoadedProfile) {
        let validIpAdress = hasValidIPaddress(ipAdress);
        console.log(validIpAdress);
        setValidIpAdress(validIpAdress);
        if (validIpAdress) {
          alert('success');
        }
        //let mobileDriver: MobileDriver = MobileDriver.getInstance();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <p>{ipAdress}</p>
          <h3>Add the IP of your phone</h3>
          <CustomInput handleChange={handleChange} />
          <CustomDialog />
          <button onClick={handleNextClick}>Check ip</button>

          <div className={classes.buttons}>
            <Link to="/select">
              <button>Back</button>
            </Link>

            {
              <Link to="/verification">
                <button disabled={!validIpAdress} onClick={handleNextClick}>
                  Next
                </button>
              </Link>
            }
          </div>
        </SimplePaper>
      </div>
    </div>
  );
}
