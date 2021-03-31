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
import { Error, CheckBox, Adjust, PinDropSharp } from '@material-ui/icons';
import { StepIconProps } from '@material-ui/core';
import { CortexDriver } from '../modules/CortexDriver';
import SuccessIcon from './StartPage/icon';
import CortexError from '../modules/CortexError';
import { truncate } from 'fs';

const facade = new FacadeTest();
const driver = CortexDriver.getInstance();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: '20vw',
      Height: '100%',
      
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
      backgroundColor: '#ffffff50',
      borderRadius:'4px',
      boxShadow: '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)'
    },
    successIcon: {
      color: 'green',
    },
    errorIcon: {
      color: 'red',
    },
    notHandledIcon:{
      color: 'white',
    }
  })
);

function getSteps() {
  return [
    'Requesting permission from the emotiv app',
    'Getting headset ID',
    'Connecting to headset',
  ];
}



interface stepProps{
  setData:(das:string) => void
  hasAccessError:boolean
  headsetIdError:boolean
  deviceError:boolean
  currentStep: number
  isClicked:boolean
}

export default function VerticalLinearStepper(props:stepProps) {
  const [text, setText] = useState('');
  const [headsetID, setHeadsetID] = useState('');
  const [device, setDevice] = useState('');

  // function getStepContent(step: number) {
  //   switch (step) {
  //     case 0:
  //       {
  //         hasAccess();
  //       }
  //       return text;
  //     case 1:
  //       getHeadsetID();
  //       return headsetID;
  //     case 2:
  //       getDevice();
  //       return device;
  //     default:
  //       return 'Unknown step';
  //   }
  // }


  function trueFalseStepIcon(iconProps: StepIconProps) {
      let errorIcon = <Error className={classes.errorIcon} />;
      let successIcon = <CheckBox className={classes.successIcon} />;
      let notHandledIcon = <Adjust className={classes.notHandledIcon}/>;
    
    let firstIcon = notHandledIcon;
    let secondIcon = notHandledIcon;
    let thirdIcon = notHandledIcon;
    if (iconProps.active || iconProps.completed) {
      firstIcon = props.hasAccessError ? errorIcon : successIcon;
      secondIcon = props.headsetIdError ? errorIcon : successIcon;
      thirdIcon = props.deviceError? errorIcon : successIcon;
    }
    const icons: { [index: string]: React.ReactElement } = {
      1: firstIcon,
      2: secondIcon,
      3: thirdIcon,
    };
    return <div>{icons[String(iconProps.icon)]}</div>;
  
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

 
  const sendData = () =>{
    props.setData('123')
  }

  function handleChange(){

    if(!props.isClicked){
      return -1
    }

    if(props.hasAccessError){
      console.log(props.hasAccessError)
      //setActiveStep(0)
      return 0
    }
    if(props.headsetIdError){
      console.log(props.headsetIdError)
      //setActiveStep(1)
      return 1
    }
    if(props.deviceError){
      console.log(props.deviceError)
      //setActiveStep(2)
      return 2
    }
    return 2
  }
  
  return (
    <div className={classes.root}>
      <Stepper
        className={classes.text}
        activeStep={handleChange()}
        orientation="vertical"
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <SuccessIcon hasError = {true} label = {label} ></SuccessIcon>
            {/* <StyledStepLabel StepIconComponent={Error}>
              {label}
            </StyledStepLabel> */}
            <StepContent>
            
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
