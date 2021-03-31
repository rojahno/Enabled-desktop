
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CortexError from '../../modules/CortexError';
import { CortexFacade } from '../../modules/CortexFacade';
import { MobileDriver } from '../../modules/MobileDriver';
import AddIpPage from './AddIpPage';


const AddIpContainer = () => {
    
  //Add ip useStates
  const [ipAdress, setIpAdress] = useState('No input');
  const [validIpAdress, setValidIpAdress] = useState(false);

  const history = useHistory();

  //Add ip functions

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let ip: string = event.target.value;
    setIpAdress(ip);
    if (hasValidIPaddress(ip)) {
      setValidIpAdress(true);
    } else {
      setValidIpAdress(false);
    }
  };

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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (validIpAdress) {
        handleNextClick();
      }
    }
  };

  const handleNextClick = async () => {
    try {
      let cortexFacade = new CortexFacade();
      let hasErrors = await cortexFacade.hasConnectivityErrors();

      if (hasErrors instanceof CortexError) {
        alert(hasErrors.errMessage);
      } else {
        let validIpAdress = hasValidIPaddress(ipAdress);
        console.log('valid ip: ' + validIpAdress);
        setValidIpAdress(validIpAdress);
        if (validIpAdress) {
          let mobileDriver = MobileDriver.getInstance();
          let connected = await mobileDriver.awaitSocketOpening(ipAdress);
          if (connected) {
            history.push({
              pathname: '/stream',
              //state: { ipAdress: ipAdress },
            });
          } else {
            alert(
              "Can't connect to the phone. Check the ip adress and that the application is running"
            );
          }
        }
      }
    } catch (error) {
      console.log('Handle click error: ' + error);
    }
  };

  useEffect(() => {

  }, []);

  return(
      <AddIpPage
      handleChange={handleChange}
      handleKeyPress={handleKeyPress}
      handleNextClick={handleNextClick}
      ipAdress={ipAdress}
      validIpAdress={validIpAdress}
      />
  );

 

  }

export default AddIpContainer;
