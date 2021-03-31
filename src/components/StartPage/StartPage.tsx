import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import VerticalLinearStepper from '../stepper';
import { FacadeTest } from '../../FacadeTest';
import { CortexDriver } from '../../modules/CortexDriver';
import CortexError from '../../modules/CortexError';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      minHeight:'100vh'

    },
    button: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '3px',
      marginTop: 'auto',
    },
    text:{
      marginTop:'auto',
      marginBot:'auto',
      fontSize:'12px'
    }
    })
);

const facade = new FacadeTest();
const driver = CortexDriver.getInstance();

export default function StartPage(this: any, _props: any) {
  const [data, setData] = useState('');
  const [hasAccessError, setHasAccessError] = useState(true);
  const [headsetIdError, setHeadSetIdError] = useState(false);
  const [deviceError, setDeviceError] = useState(false);
  const [stepNumber, setStepNumber] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  // useEffect(() => {
  //   const startup = async () => {
  //     try {
  //       await facade.handleSetupApp();
  //       let errors: any = facade.getSetupErrors();
  //       console.log('5435345354');
  //       setHasAccessError(errors[0]);
  //       setHeadSetIdError(errors[1]);
  //       setDeviceError(errors[2]);
  //     } catch (error) {
  //       if (error instanceof CortexError) {
  //         alert(error.errMessage);
  //       }
  //     }
  //   };

  //   startup();
  // }, []);

  async function handleStart() {
    try {
      await facade.handleSetupApp();
      let errors: any = facade.getSetupErrors();
      console.log('5435345354');
      setHasAccessError(true);
      setHeadSetIdError(errors[1]);
      setDeviceError(errors[2]);
      setIsClicked(true);
    } catch (error) {
      if (error instanceof CortexError) {
        alert(error.errMessage);
      }
    }
  }

  const setError = () => {
    setHasAccessError(!hasAccessError);
  };

  const enableNext = () => {
    if (!hasAccessError && !headsetIdError && !deviceError) {
      return false;
    } else return true;
  };

  const setChildData = (childData: string) => {
    console.log('Startpage: set child data called');
    setData(childData);
  };

  const testUpdate = () => {
    console.log(data);
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <div>
        <SimplePaper>
         <VerticalLinearStepper setData = {setChildData} 
                                hasAccessError = {hasAccessError}
                                headsetIdError = {headsetIdError}
                                deviceError = {deviceError}
                                currentStep = {stepNumber}
                                isClicked = {isClicked}
                                />
                                
        <div className = {classes.text}>
         <h3 hidden = {!isClicked}>{hasAccessError ? 'Could not connect to the emotiv app, try to go to the app and permit access': 'Connected to the emotiv app'}</h3>
         <h3 hidden = {!isClicked}>{headsetIdError ? 'Could not retrieve the ID of your headset': 'Headset ID retrieved'}</h3>
         <h3 hidden = {!isClicked}>{deviceError ? 'Could not connect to your emotiv device':'Connected to emotiv device'}</h3>
        </div>
         <div className = {classes.button}>
        <button onClick = {handleStart}>{isClicked ? 'Reconnect':'Connect'}</button>
        <Link to = '/select'>
        <button disabled={enableNext()}>Next</button>
        </Link>
         </div>
      </SimplePaper>
         </div>
    </div>
  );
}
