import React, { useState, useEffect } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import { CortexDriver } from '../../modules/CortexDriver';
import VerticalLinearStepper from '../stepper';
import { MobileDriver } from '../../modules/MobileDriver';

useState

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
  const [currentProfile, setCurrentProfile] = useState('');

  useEffect(() => {
    let driver: CortexDriver = CortexDriver.getInstance();
    let webSocket = driver.socket;

      const setup = async() =>{
        console.log("setup called");
        try{
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
        const currentProfile: string = await driver.getCurrentProfile(
          authToken,
          id
        );
        setCurrentProfile(currentProfile);
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
        <p>Error:{errorMsg} </p>

        <button>Try again</button>
      </SimplePaper>
    </div>
  );
};
export default VerificationPage;
