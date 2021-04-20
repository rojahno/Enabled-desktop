import React, { useEffect, useState } from 'react';
import { CortexDriver } from '../../modules/CortexDriver';
import CortexError from '../../modules/CortexError';
import { MobileDriver } from '../../modules/MobileDriver';
import StreamPage from './StreamPage';

const StreamContainer = () => {
  //Stream useStates
  const [headsetId, setHeadsetId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [sessionId, setsessionId] = useState('');
  const [profile, setProfile] = useState('');
  const [isComStream, setIsComStream] = useState(true);

  const [sensitivity, setSensitivity] = useState<number>();
  const [activeCommands, setActiveCommands] = useState<string[]>();

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
        let driver: CortexDriver = CortexDriver.getInstance();
        let sensitivity = [value, value, value, value];
        await driver.setSensitivity(authToken, profile, sessionId, sensitivity);
        await driver.saveProfile(authToken, headsetId, profile);
        let newSensitivity = await driver.getSensitivity(authToken, profile);
        if (isComStream) {
          driver.setComStreamOnmessageEvent();
        } else {
          driver.setFacStreamOnmessageEvent();
        }
        setSensitivity(newSensitivity[0]);
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
      let driver: CortexDriver = CortexDriver.getInstance();
      await driver.closeSession();
      let sessionId: string = await driver.createSession(authToken, headsetId);
      let signature = await driver.setFacialExpressionSignatureType(authToken,sessionId);
      console.log("signature: "+ signature);
      await driver.startFacStream(authToken, sessionId);
      setsessionId(sessionId);
      setIsComStream(false);
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
      let driver: CortexDriver = CortexDriver.getInstance();
      await driver.closeSession();
      let sessionId: string = await driver.createSession(authToken, headsetId);
      await driver.startComStream(authToken, sessionId);
      setsessionId(sessionId);
      setIsComStream(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const start = async () => {
      try {
        let driver: CortexDriver = CortexDriver.getInstance();
        let authToken: string = await driver.authorize();
        let headsetId: string = await driver.queryHeadsetId();
        let sessionId: string = await driver.createSession(
          authToken,
          headsetId
        );
        let profile: string = await driver.getCurrentProfile(
          authToken,
          headsetId
        );
        let sensitivity: number[] = await driver.getSensitivity(
          authToken,
          profile
        );

        let commands = await driver.getMentalCommandActiveActionRequest(
          authToken,
          profile
        );
        let startStream: boolean = await driver.startComStream(
          authToken,
          sessionId
        );
        console.log('started stream: ' + startStream);

        setAuthToken(authToken);
        setHeadsetId(headsetId);
        setsessionId(sessionId);
        setSensitivity(sensitivity[0]);
        setProfile(profile);
        console.log(commands);
      } catch (error) {
        if (error instanceof CortexError) {
          alert(error.errMessage);
        } else {
          console.error(error);
        }
      }
    };
    start();

    const offLoad = () => {
      let mobileDriver: MobileDriver = MobileDriver.getInstance();
      let driver: CortexDriver = CortexDriver.getInstance();
      driver.closeSession();
      mobileDriver.closeSocket();
    };

    return () => offLoad();
  }, []);

  return (
    <StreamPage
      handleChange={handleChange}
      handleComPress={handleComPress}
      handleFacPress={handleFacPress}
      isComStream={isComStream}
    />
  );
};

export default StreamContainer;
