import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { CortexDriver } from '../../modules/CortexDriver';
import { Link } from 'react-router-dom';
import { MobileDriver } from '../../modules/MobileDriver';
import SettingSlider from '../settings/SettingSlider';
import CortexError from '../../modules/CortexError';
import { Tab, Tabs } from '@material-ui/core';
import CustomStreamDialog from './CustomStreamDialog';

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
<<<<<<< Updated upstream
=======
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize:'15px',
      padding: '15px',
    },
    dialog:{
      paddingTop:'10px'
    },
>>>>>>> Stashed changes
  })
);

export default function StreamPage(props: any) {
  const classes = useStyles();
  const [headsetId, setHeadsetId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [sessionId, setsessionId] = useState('');
  const [profile, setProfile] = useState('');
  const [ip, setIp] = useState('');
  const [sensitivity, setSensitivity] = useState<number>();
  const [activeCommands, setActiveCommands] = useState<string[]>();

  const [value, setValue] = useState(0)

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    console.log('value is: ' + value)
  }



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
      driver.setStreamOnmessageEvent();
    setSensitivity(newSensitivity[0]);
    }
  };

  const startStream = () => {
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
        let commands = await driver.getMentalCommandActiveActionRequest(
          authToken,
          profile
        );

        startStream();
        setAuthToken(authToken);
        setHeadsetId(headsetId);
        setsessionId(sessionId);
        setSensitivity(sensitivity[0]);
        setProfile(profile);
        setActiveCommands(commands);
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
<<<<<<< Updated upstream
          <p>{'Connected to: ' + ip} </p>
          <p>{'Sensitivity: ' + sensitivity} </p>
          <p>{'Commands: ' + activeCommands} </p>
          <SettingSlider handleChange={handleChange} />
=======
          <SettingSlider
            sliderTitle={'Headset sensitivity'}
            handleChange={handleChange}
            minSteps={1}
            maxSteps={10}
            disabled={!isComStream}
          />
          <div className={classes.textContainer}>
            <p>
              Moving the slider to the right (10) will make it easier to
              trigger. Moving the slider to the left (1) will make the commands
              harder to trigger.
            </p>
          </div>
          <Tabs
    value={value}
    indicatorColor="primary"
    textColor="primary"
    onChange={handleTabChange}
    aria-label="disabled tabs example"
  >
    <Tab label="Command Stream" onClick={handleComPress} />
    <Tab label="Expression Stream" onClick={handleFacPress} />
  </Tabs>
  <div className={classes.dialog}>
  <CustomStreamDialog/>
  </div>
          {/* <button disabled={isComStream} onClick={handleComPress}>
            Mental command stream
          </button>

          <button disabled={!isComStream} onClick={handleFacPress}>
            Facial expression stream
          </button> */}
>>>>>>> Stashed changes
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
