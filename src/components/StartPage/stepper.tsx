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
import { Error, CheckBox, Adjust } from '@material-ui/icons';
import { StepIconProps } from '@material-ui/core';
import StepperContent from './StepperContent';

const StyledStepLabel = styled(StepLabel)({
  '& .MuiStepLabel-label': {
    color: '#3c3c3c',
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
    typegraphy: {
      color: '#3c3c3cee',
      fontSize: '14px',
      
    },
  })
);

function getSteps() {
  return [
    'Requesting permission from the Emotiv app',
    'Looking for available headsets',
    'Connecting to the headset',
  ];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return 'Could not connect to the Emotiv app, try to go to the Emotiv BCI app to permit access.';
    case 1:
      return 'Could not find any headset. Please make sure the headset is turned on and connected.';
    case 2:
      return 'Could not connect to your Emotiv headset. Please restart the device and try again.';
    default:
      return 'Unknown step';
  }
}

interface stepProps {
  hasAccessError: boolean;
  headsetIdError: boolean;
  deviceError: boolean;
  hasError: boolean;
  isClicked: boolean;
}

export default function VerticalLinearStepper(props: stepProps) {
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

  function handleChange() {
    if (!props.isClicked) {
      return -1;
    }
    if (props.hasAccessError) {
      return 0;
    }
    if (props.headsetIdError) {
      return 1;
    }
    if (props.deviceError) {
      return 2;
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
            <StepContent className={classes.typegraphy} >
              <StepperContent showContent={props.hasError}>{getStepContent(index)}</StepperContent>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
