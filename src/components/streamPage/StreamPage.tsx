import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { CortexDriver } from '../../modules/CortexDriver';
import { Link } from 'react-router-dom';
import { MobileDriver } from '../../modules/MobileDriver';
import SettingSlider from '../settings/SettingSlider';
import CortexError from '../../modules/CortexError';

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
    buttons: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      width: '100%',
      height: '100%',
      padding: '3px',
    },
  })
);

export default function StreamPage(props: any) {
  const classes = useStyles();
  const [headsetId, setHeadsetId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [sessionId, setsessionId] = useState('');
  const [profile, setProfile] = useState('');
  const [ip, setIp] = useState('');
  const [sensitivity, setSensitivity] = useState<number[]>();
  const [activeCommands, setActiveCommands] = useState<string[]>();

  const handleChange = async (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      let driver: CortexDriver = CortexDriver.getInstance();
      let sensitivity = [value, value, value, value];
      let values = [7, 7, 7, 7];
      console.log('Value: ' + sensitivity);
      console.log('Profile: ' + profile);
      let authToken: string = await driver.authorize();
      setAuthToken(authToken);
      await driver.setSensitivity(authToken, profile, sessionId, sensitivity, headsetId);
    }
  };

  const getSensitivity = async () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    let sensitivity = await driver.getSensitivity(authToken, profile);
    let commands = await driver.getMentalCommandActiveActionRequest(
      authToken,
      profile
    );
    setSensitivity(sensitivity);
    setActiveCommands(commands);
    console.log(sensitivity);
  };

  const startStream = async () => {
    let driver: CortexDriver = CortexDriver.getInstance();
    driver.startStream(authToken, sessionId);
  };

  useEffect(() => {
    let ip: string = props.location.state.ipAdress;
    setIp(ip);

    const start = async () => {
      try {
        let driver: CortexDriver = CortexDriver.getInstance();
        let authToken: string = await driver.authorize();
        let headsetId: string = await driver.queryHeadsetId();
        let sessionId = await driver.createSession(authToken, headsetId);
        let profile = await driver.getCurrentProfile(authToken, headsetId);
        let sensitivity = await driver.getSensitivity(authToken, profile);

        setAuthToken(authToken);
        setHeadsetId(headsetId);
        setsessionId(sessionId);
        setSensitivity(sensitivity);
        setProfile(profile);
        console.log('profile: ' + profile);
      } catch (error) {
        if (error instanceof CortexError) {
          alert(error.errMessage);
        }
      }
    };

    const offLoad = () => {
      let mobileDriver: MobileDriver = MobileDriver.getInstance();
      let driver: CortexDriver = CortexDriver.getInstance();
      driver.stopStream();
      mobileDriver.closeSocket();
    };

    start();

    return () => offLoad();
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Stream:</h3>
          <p>{'Connected to: ' + ip} </p>
          <p>{'Sensitivity: ' + sensitivity} </p>
          <p>{'Commands: ' + activeCommands} </p>
          <SettingSlider handleChange={handleChange} />
          <button onClick={getSensitivity}>få sensitivity</button>
          <button onClick={startStream}>start stream</button>

          <div className={classes.buttons}>
            <Link to="/ip">
              <button>Back</button>
            </Link>
          </div>
        </SimplePaper>
      </div>
    </div>
  );
}
