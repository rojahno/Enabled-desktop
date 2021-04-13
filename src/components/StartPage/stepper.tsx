import React from 'react';
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
import { Error, CheckBox, Adjust} from '@material-ui/icons';
import { StepIconProps } from '@material-ui/core';


const StyledStepLabel = styled(StepLabel)({
  '& .MuiStepLabel-label': {
    color: '#3c3c3c',
  },
});


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

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
      backgroundColor: '#ffffff00',
      borderRadius: '4px',
      //boxShadow: '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)'
    },
    successIcon: {
      color: 'green',
    },
    errorIcon: {
      color: 'red',
    },
    notHandledIcon: {
      color: 'white',
    },
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
  hasAccessError:boolean
  headsetIdError:boolean
  deviceError:boolean
  isClicked:boolean
}

export default function VerticalLinearStepper(props:stepProps) {

  function trueFalseStepIcon(iconProps: StepIconProps) {
    let errorIcon = <Error className={classes.errorIcon} />;
    let successIcon = <CheckBox className={classes.successIcon} />;
    let notHandledIcon = <Adjust className={classes.notHandledIcon} />;

    let firstIcon = notHandledIcon;
    let secondIcon = notHandledIcon;
    let thirdIcon = notHandledIcon;
    if (iconProps.active || iconProps.completed) {
      firstIcon = props.hasAccessError ? errorIcon : successIcon;
      secondIcon = props.headsetIdError ? errorIcon : successIcon;
      thirdIcon = props.deviceError ? errorIcon : successIcon;
    }
    const icons: { [index: string]: React.ReactElement } = {
      1: firstIcon,
      2: secondIcon,
      3: thirdIcon,
    };
    return <div>{icons[String(iconProps.icon)]}</div>;
  }
  const classes = useStyles();
  const steps = getSteps();

  function handleChange(){

    if(!props.isClicked){
      return -1
    }
    if(props.hasAccessError){
      console.log(props.hasAccessError)
      return 0
    }
    if(props.headsetIdError){
      console.log(props.headsetIdError)
      return 1
    }
    if(props.deviceError){
      console.log(props.deviceError)
      return 2
    }
    return 2;
  }

  return (
    <div>
      <Stepper
        className={classes.text}
        activeStep={handleChange()}
        orientation="vertical"
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StyledStepLabel StepIconComponent={trueFalseStepIcon}>
              {label}
            </StyledStepLabel>
            <StepContent></StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
