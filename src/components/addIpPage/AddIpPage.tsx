import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../SimplePaper';
import { CortexDriver } from '../../modules/CortexDriver';
import { useHistory } from 'react-router-dom';
import { MobileDriver } from '../../modules/MobileDriver';
import NavigationButtons from '../selectProfile/NavigationButtons';

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
  return false;
};

export default function AddIpPage(_props: any) {
  const classes = useStyles();
  const [ipAdress, setIpAdress] = useState('No input');
  const [validIpAdress, setValidIpAdress] = useState(false);

  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let ip: string = event.target.value;
    setIpAdress(ip);
    if (hasValidIPaddress(ip)) {
      setValidIpAdress(true);
    } else {
      setValidIpAdress(false);
    }
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
        console.log('valid ip: ' + validIpAdress);
        setValidIpAdress(validIpAdress);
        if (validIpAdress) {
          let mobileDriver = MobileDriver.getInstance();
          let connected = await mobileDriver.awaitSocketOpening(ipAdress);
          if(connected){
          history.push({ pathname: '/stream', state: { ipAdress: ipAdress } });
          }
          else{
            alert('Can\'t connect to the phone. Check the ip adress and that the application is running');
          }
        }
      }
    } catch (error) {
      console.log('Handle click: ' + error);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Add the IP of your phone</h3>
          <CustomInput handleChange={handleChange} />
          <CustomDialog />
          <NavigationButtons canNavigateForward={validIpAdress}
          handleNextClick={handleNextClick}
          backNavigation ={'/select'} />
        </SimplePaper>
      </div>
    </div>
  );
}
