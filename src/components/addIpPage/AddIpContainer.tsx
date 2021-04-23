import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CortexError from '../../modules/CortexError';
import { CortexFacade } from '../../modules/CortexFacade';
import { MobileDriver } from '../../modules/MobileDriver';
import AddIpPage from './AddIpPage';

const AddIpContainer = () => {
  const [ipAdress, setIpAdress] = useState('No input');
  const [validIpAdress, setValidIpAdress] = useState(false);
  const [openLoadingCircle, setOpenLoadingCircle] = useState(false);

  const history = useHistory();

  /**
   * Checks if the input is a valid ip adress when the input is changed.
   * @param event the input event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let ip: string = event.target.value;
    setIpAdress(ip);
    if (hasValidIPaddress(ip)) {
      setValidIpAdress(true);
    } else {
      setValidIpAdress(false);
    }
  };

  /**
   * Check if the ip adress is valid.
   * @param ipAdress The ip adress we would like to check
   * @returns
   */
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

  /**
   * Handles the enter key press.
   * @param event The keypress event
   */
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (validIpAdress) {
        handleNextClick();
      }
    }
  };
  /**
   * Handles the next button click.
   */
  const handleNextClick = async () => {
    try {
      setOpenLoadingCircle(true);
      let cortexFacade = new CortexFacade();
      let hasErrors = await cortexFacade.hasConnectivityErrors();

      if (hasErrors instanceof CortexError) {
        alert(hasErrors.errMessage);
        setOpenLoadingCircle(false);
      } else {
        let validIpAdress = hasValidIPaddress(ipAdress);
        console.log('valid ip: ' + validIpAdress);
        setValidIpAdress(validIpAdress);
        if (validIpAdress) {
          let mobileDriver = MobileDriver.getInstance();
          let connected = await mobileDriver.awaitSocketOpening(ipAdress);
          if (connected) {
            setOpenLoadingCircle(false);
            history.push({
              pathname: '/stream',
            });
          } else {
            setOpenLoadingCircle(false);
            alert(
              "Can't connect to the phone. Check the ip adress and that the app is running"
            );
          }
        }
      }
    } catch (error) {
      console.log('Handle click error: ' + error);
      setOpenLoadingCircle(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <AddIpPage
      handleChange={handleChange}
      handleKeyPress={handleKeyPress}
      handleNextClick={handleNextClick}
      ipAdress={ipAdress}
      validIpAdress={validIpAdress}
      openLoadingCircle={openLoadingCircle}
    />
  );
};

export default AddIpContainer;
