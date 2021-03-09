import React, { useState, useEffect } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import { CortexDriver, StreamObserver } from '../../modules/CortexDriver';
import VerticalLinearStepper from '../stepper';
import { MobileDriver } from '../../modules/MobileDriver';

useState;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

const mobileDriver = null;
const VerificationPage = (_props: any) => {
  const classes = useStyles();
  const [access, setAccess] = useState(false);
  const [headsetID, setHeadsetID] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [requestAcceess, setrequestAcceess] = useState('');
  const [deviceData, setDeviceData] = useState('');
  const [token, setToken] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');
  const [stream, setStream] = useState('');

  const onStreamUpdated: StreamObserver = (streamCommand: string) => {
    setStream(streamCommand);
  };

  

  useEffect(() => {
    let driver: CortexDriver = CortexDriver.getInstance();


    const offLoad = () => {
    driver.unsubscribe(onStreamUpdated);
    driver.stopStream();
    }

    const setup = async () => {
      console.log('setup called');
      try {
        driver.subscribe(onStreamUpdated);
        //-----------------------------
        const accessGranted: boolean = await driver.hasAccess();
        setAccess(accessGranted);
        //-----------------------------
        if (!accessGranted) {
          const requestAccess: string = await driver.requestAccess();
          setrequestAcceess(requestAccess);
        }
        //-----------------------------
        const id: string = await driver.queryHeadsetId();
        setHeadsetID(id);
        //-----------------------------
        const controlID: string = await driver.controlDevice(id);
        setDeviceData(controlID);
        //-----------------------------
        const authToken: string = await driver.authorize();
        setToken(authToken);
        //-----------------------------

        const sessionId: string = await driver.createSession(authToken, id);
        setSessionId(sessionId);

        const currentProfile: string = await driver.getCurrentProfile(
          authToken,
          id
        );
        setCurrentProfile(currentProfile);


        let sensitivity = [10,10,10,10];
        await driver.setupProfile(authToken,id,"D7","load");
        driver.startStream(authToken, sessionId);
        await driver.setSensitivity(authToken,"D7",sessionId, sensitivity);
        console.log("before stream");

      } catch (error) {
        if (typeof error === 'string') {
          setErrorMsg(error);
        } else {
          setErrorMsg('An error has occured');
        }
      }
    };
    /*
    let mobile: MobileDriver = new MobileDriver();
    let mobileSocket = mobile.socket;
    console.log(mobileSocket);
    mobileSocket.onopen =async() =>{
      console.log("er her");
      try{
        console.log("Før send something");
         mobile.sendSomething("hei");
         console.log("etter send something");
      }
      catch(error){
        alert('fucked up');
      }
    }
    mobileSocket.onerror = () =>{
      console.log("on error");
      
    }
    */
    setup();

    return () => offLoad();
  }, []);

  return (
    <div className={classes.root}>
      <SimplePaper>
        <p>Has access:{access.toString()} </p>
        <p>Request access:{requestAcceess} </p>
        <p>Headset connected:{headsetID} </p>
        <p>Device data:{deviceData} </p>
        <p>Token:{} </p>
        <p>Current profile: {currentProfile}</p>
        <p>Stream:{stream} </p>
        <p>Error:{errorMsg} </p>
        <button>Try again</button>
      </SimplePaper>
    </div>
  );
};
export default VerificationPage;
