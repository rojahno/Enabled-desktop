import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  styled,
} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { FacadeTest } from '../FacadeTest';
import { Error, CheckBox, Adjust } from '@material-ui/icons';
import { StepIconProps } from '@material-ui/core';
import { CortexDriver } from '../modules/CortexDriver';
import SuccessIcon from './StartPage/icon';
import CortexError from '../modules/CortexError';
import { truncate } from 'fs';

const StyledStepLabel = styled(StepLabel)({
  '& .MuiStepLabel-label': {
    color: '#fff',
  },
});

const facade = new FacadeTest();
const driver = CortexDriver.getInstance();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '15vw',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    text: {
      color: '#fff',
      backgroundColor: '#ffffff27',
    },
    successIcon: {
      color: 'green',
    },
    errorIcon: {
      color: 'red',
    },
  })
);

function getSteps() {
  return [
    'Request permission from the emotiv app',
    'Create an ad group',
    'Create an ad',
  ];
}

export default function VerticalLinearStepper() {
  const [text, setText] = useState('');
  const [headsetID, setHeadsetID] = useState('');
  const [device, setDevice] = useState('');
  const [hasAccessError, setHasAccessError] = useState(false);
  const [headsetIdError, setHeadSetIdError] = useState(false);
  const [deviceError, setDeviceError] = useState(true);

  // function trueFalseStepIcon(bool: string){
  //   let iconArray = icons.slice()
  //   if(bool === 'true'){iconArray.push(CheckBox)}

  // }

  async function hasAccess() {
    console.log('==============');
    let b: boolean = await driver.hasAccess();
    console.log(b);
    if (b) {
      setText('You are connected to the app');
      setHasAccessError(false);
    } else {
      setText(
        'Could not connect to emotiv app, make sure to give access in emotiv app'
      );
      setHasAccessError(true);
    }
  }

  async function getHeadsetID() {
    let s = await facade.getheadsetID();
    setHeadsetID(s);
    setHeadSetIdError(true);
  }

  async function getDevice() {
    let s = await facade.getDevice();
    setDevice(s);
    setDeviceError(true);
  }

  // function handleStepMovement(){
  //   if(!hasAccessError){
  //     handleNext()
  //   }else{
  //     return
  //   }
  //   if(!headsetIdError){
  //     handleNext()
  //   }else{
  //     return
  //   }
  //   if(!deviceError){
  //     handleNext()
  //   }else{
  //     return
  //   }

  // }

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        {
          hasAccess();
        }
        return text;
      case 1:
        getHeadsetID();
        return headsetID;
      case 2:
        getDevice();
        return device;
      default:
        return 'Unknown step';
    }
  }

  const handleChange = (text: string) => (event: React.ChangeEvent<{}>) => {
    setText(text);
  };

  function trueFalseStepIcon(props: StepIconProps) {
    let errorIcon = <Error className={classes.errorIcon} />;
    let successIcon = <CheckBox className={classes.successIcon} />;
    let notHandledIcon = <Adjust />;

    let firstIcon = notHandledIcon;
    let secondIcon = notHandledIcon;
    let thirdIcon = notHandledIcon;
    if (props.active || props.completed) {
      firstIcon = hasAccessError ? errorIcon : successIcon;
      secondIcon = headsetIdError ? errorIcon : successIcon;
      thirdIcon = deviceError ? errorIcon : successIcon;
    }
    const icons: { [index: string]: React.ReactElement } = {
      1: firstIcon,
      2: secondIcon,
      3: thirdIcon,
    };
    return <div>{icons[String(props.icon)]}</div>;
  }
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  async function handleStart() {
    try {
      await facade.handleSetupApp();
      let errors: any = facade.getSetupErrors();
      console.log('5435345354');
      setHasAccessError(errors[0]);
      setHeadSetIdError(errors[1]);
      setDeviceError(errors[2]);
      //handleStepMovement()
    } catch (error) {
      if (error instanceof CortexError) {
        alert(error.errMessage);
      }
    }
  }

  useEffect(() => {
    const start = async () => {
      try {
        await facade.handleSetupApp();
        let errors: any = facade.getSetupErrors();
        console.log('5435345354');
        setHasAccessError(errors[0]);
        setHeadSetIdError(errors[1]);
        setDeviceError(errors[2]);
        //handleStepMovement()
      } catch (error) {
        if (error instanceof CortexError) {
          alert(error.errMessage);
        }
      }
    };
    start();
  }, []);

  return (
    <div className={classes.root}>
      <Button onClick={handleStart}>Connect</Button>
      <Stepper
        className={classes.text}
        activeStep={activeStep}
        orientation="vertical"
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StyledStepLabel StepIconComponent={trueFalseStepIcon}>
              {label}
            </StyledStepLabel>
            <StepContent>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => {
                      handleBack();
                    }}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleNext();
                    }}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
