import React, { useState, useEffect } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import { CortexDriver } from '../../modules/CortexDriver';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

/*
 const initCortex = async () => {
    try {
      let accessGranted: boolean = await hasAccess();
      console.log('bool' + accessGranted);
      this.setState({hasAccess: accessGranted });

      if (!accessGranted) {
        let access: string = await requestAccess(webSocket, user);
        this.setState({ access: access });
      }

      const id: string = await queryHeadsetId(webSocket);
      this.setState({ headsetId: id });

      const controlID: string = await controlDevice(
        this.state.headsetId,
        webSocket
      );
      this.setState({ controlId: controlID });

      const token = await authorize(webSocket, user);
      this.setState({ cortexToken: token });

      const sessionId = await createSession(
        webSocket,
        this.state.cortexToken,
        this.state.headsetId
      );
      this.setState({ sessionId: sessionId });

      const currentProfile = await getCurrentProfile(
        webSocket,
        this.state.cortexToken,
        this.state.headsetId
      );
      this.setState({ thisProfile: currentProfile });
    } catch (error) {
      this.setState({ errorMsg: 'check headset and connection' });
    }
  };
  */

const VerificationPage = (_props: any) => {
  const classes = useStyles();
  const [access, setAccess] = useState(false);
  const [headsetID, setHeadsetID] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [requestAcceess, setrequestAcceess] = useState('');
  const [deviceData, setDeviceData] = useState('');
  const [token, setToken] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');

  let driver: CortexDriver = new CortexDriver();
  let webSocket = driver.socket;

  useEffect(() => {
    webSocket.onopen = async () => {
      try {
        //-----------------------------
        const accessGranted: boolean = await driver.hasAccess();
        setAccess(accessGranted);
        //-----------------------------
        if (!accessGranted) {
          //Maybe throw error, since they need to accept it on the emotive app???
          const requestAccess: string = await driver.requestAccess();
          setrequestAcceess(requestAccess);
        }
        //-----------------------------
        const id: string = await driver.queryHeadsetId();
        setHeadsetID(id);
        //-----------------------------
        const controlID: string = await driver.controlDevice(headsetID);
        setDeviceData(controlID);
        //-----------------------------
        const authToken:string = await driver.authorize();
        //authToken = authToken.slice(0,20);
        setToken(authToken);
        //-----------------------------
        //const currentProfile:string = await driver.getCurrentProfile(token, id);
        //setCurrentProfile(currentProfile);
        

      } catch (error) {
        setErrorMsg(error);
      }
    };
  },[]);

  return (
    <div className={classes.root}>
      <SimplePaper>
        <p>Has access:{access.toString()} </p>
        <p>Request access:{requestAcceess} </p>
        <p>Headset connected:{headsetID} </p>
        <p>Device data:{deviceData} </p>
        <p>Token:{token} </p>
        <p>Current profile: {currentProfile}</p>
        <p>Error:{errorMsg} </p>

        <button>Try again</button>
      </SimplePaper>
    </div>
  );
};
export default VerificationPage;
