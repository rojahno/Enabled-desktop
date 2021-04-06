import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import VerticalLinearStepper from '../stepper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '3px',
      marginTop: 'auto',
    },
    text: {
      marginTop: 'auto',
      marginBot: 'auto',
      fontSize: '12px',
    },
  })
);

interface StartPageProps {
  hasAccessError: boolean;
  headsetIdError: boolean;
  deviceError: boolean;
  isClicked: boolean;
  connectClicked: () => void;
}

export default function StartPage(props: StartPageProps) {
  const classes = useStyles();

  const enableNext = () => {
    if (!props.hasAccessError && !props.headsetIdError && !props.deviceError) {
      return false;
    } else return true;
  };

  return (
    <SimplePaper>
      <VerticalLinearStepper
        hasAccessError={props.hasAccessError}
        headsetIdError={props.headsetIdError}
        deviceError={props.deviceError}
        isClicked={props.isClicked}
      />

      <div className={classes.text}>
        <h3 hidden={!props.isClicked}>
          {props.hasAccessError
            ? 'Could not connect to the emotiv app, try to go to the emotiv app to permit access'
            : 'Connected to the emotiv app'}
        </h3>
        <h3 hidden={!props.isClicked}>
          {props.headsetIdError
            ? 'Could not retrieve the ID of your headset, please try to reconnect your emotiv headwear'
            : 'Headset ID retrieved'}
        </h3>
        <h3 hidden={!props.isClicked}>
          {props.deviceError
            ? 'Could not connect to your emotiv device, check that your device is connected and not in need of a firmware update'
            : 'Connected to emotiv device'}
        </h3>
      </div>
      <div className={classes.button}>
        <button onClick={props.connectClicked}>
          {props.isClicked ? 'Reconnect' : 'Connect'}
        </button>
        <Link to="/select">
          <button disabled={enableNext()}>Next</button>
        </Link>
      </div>
    </SimplePaper>
  );
}
