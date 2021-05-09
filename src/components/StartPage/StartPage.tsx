import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../utils/SimplePaper';
import { useHistory } from 'react-router-dom';
import VerticalLinearStepper from '../startPage/stepper';

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
      padding: '12px',
      fontSize: '12px',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      flexGrow: 1,
      overflow: 'auto',
      width: '100%',
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
  const history = useHistory();

  /**
   * Enables or disables the next button.
   * @returns true if no errors occurs and false one or more errors occured.
   */
  const enableNext = () => {
    if (!props.hasAccessError && !props.headsetIdError && !props.deviceError) {
      return false;
    } else return true;
  };
  /**
   * Navigates to the next page.
   */
  const navigateNext = () => {
    history.push({ pathname: '/select' });
  };

  return (
    <SimplePaper>
      <div className={classes.content}>
        <VerticalLinearStepper
          hasAccessError={props.hasAccessError}
          headsetIdError={props.headsetIdError}
          deviceError={props.deviceError}
          isClicked={props.isClicked}
        />

        <div className={classes.text}>
          <h3 hidden={!props.isClicked}>
            {props.hasAccessError
              ? 'Could not connect to the Emotiv app, try to go to the Emotiv BCI app to permit access.'
              : 'Connected to the Emotiv BCI app.'}
          </h3>
          <h3 hidden={!props.isClicked}>
            {props.headsetIdError
              ? 'Could not find any headset. Please make sure the headset is turned on and connected.'
              : 'Headset found.'}
          </h3>
          <h3 hidden={!props.isClicked}>
            {props.deviceError
              ? 'Could not connect to your Emotiv headset. Please restart the device and try again.'
              : 'Connected to emotiv headset.'}
          </h3>
        </div>
      </div>
      <div className={classes.button}>
        <button onClick={props.connectClicked}>
          {props.isClicked ? 'Reconnect' : 'Connect'}
        </button>

        <button onClick={navigateNext} disabled={enableNext()}>
          Next
        </button>
      </div>
    </SimplePaper>
  );
}
