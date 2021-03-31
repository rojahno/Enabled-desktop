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

  //Stream page functions

  const handleChange = async (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      let driver: CortexDriver = CortexDriver.getInstance();
      let sensitivity = [value, value, value, value];
      await driver.setSensitivity(authToken, profile, sessionId, sensitivity);
      await driver.saveProfile(authToken, headsetId, profile);
      let newSensitivity = await driver.getSensitivity(authToken, profile);
      if(isComStream){
      driver.setComStreamOnmessageEvent();
      }
      else{
        driver.setFacStreamOnmessageEvent();
      }
      setSensitivity(newSensitivity[0]);
    }
  };

  const handleFacPress = async () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    await driver.closeSession();
    let sessionId: string = await driver.createSession(authToken, headsetId);
    await driver.startFacStream(authToken, sessionId);
    setsessionId(sessionId);
    setIsComStream(false);
  };

  const handleComPress = async () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    await driver.closeSession();
    let sessionId: string = await driver.createSession(authToken, headsetId);
    await driver.startComStream(authToken, sessionId);
    setsessionId(sessionId);
    setIsComStream(true);
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

  return <StreamPage
  handleChange={handleChange}
  handleComPress={handleComPress}
  handleFacPress={handleFacPress}
  isComStream={isComStream}/>;
};

export default StreamContainer;
