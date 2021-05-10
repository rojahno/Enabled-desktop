import React, { useEffect, useState } from 'react';
import CortexError from '../../modules/CortexError';
import { CortexFacade } from '../../modules/CortexFacade';
import { MobileDriver } from '../../modules/MobileDriver';
import StreamPage from './StreamPage';

const StreamContainer = () => {
  //Stream useStates

  const [isComStream, setIsComStream] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const cortexFacade = CortexFacade.getInstance();

  /**
   * Changes the sensitivity of the selected profile.
   * @param event The slider event
   * @param value The new value from the event
   */
  const handleChange = async (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    try {
      if (typeof value === 'number') {
        let sensitivity = [value, value, value, value];
        let facadeError = cortexFacade.setHeadsetSensitivity(
          sensitivity,
          isComStream
        );
        if (facadeError instanceof CortexError) {
          alert(facadeError.errMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * Closes the previous session and creates a new session and stream.
   * Starts the fac stream.
   */
  const handleFacPress = async () => {
    try {
      let changedStreamError = cortexFacade.changeToFacStream();
      if (changedStreamError instanceof CortexError) {
        alert(changedStreamError.errMessage);
      } else {
        setIsComStream(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Closes the previous session and creates a new session and stream.
   * Starts the com stream
   */
  const handleComPress = async () => {
    try {
      let changedStreamError = cortexFacade.changeToComStream();
      if (changedStreamError instanceof CortexError) {
        alert(changedStreamError.errMessage);
      } else {
        setIsComStream(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const start = async () => {
      try {
        let facadeError = cortexFacade.startStream();
        if (facadeError instanceof CortexError) {
          alert(facadeError.errMessage);
        }
      } catch (error) {
        console.error(error);
      }
    };

    start();

    const offLoad = () => {
      let mobileDriver: MobileDriver = MobileDriver.getInstance();
      cortexFacade.closeSession();
      mobileDriver.closeSocket();
    };

    return () => offLoad();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let mobileDriver: MobileDriver = MobileDriver.getInstance();

      if (!mobileDriver.isConnected()) {
        if (isConnected) {
          setIsConnected(false);
        }
      } else {
        if (!isConnected) {
          setIsConnected(true);
        }
      }
    }, 1000);

    const offLoad = () => {
      clearInterval(intervalId);
    };

    return () => offLoad();
  }, [isConnected]);

  return (
    <StreamPage
      handleChange={handleChange}
      handleComPress={handleComPress}
      handleFacPress={handleFacPress}
      isComStream={isComStream}
      isConnected={isConnected}
    />
  );
};

export default StreamContainer;
