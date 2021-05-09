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
      justifyContent:'center',
      alignItems:'center',
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
  hasError: boolean;
  connectClicked: () => void;
}

export default function StartPage(props: StartPageProps) {
  const classes = useStyles();
  const history = useHistory();

  /**
   * Enables or disables the next button.
   * @returns true if no errors occurs and false if an error occurr.
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
      <h3>Setup</h3>
      <div className={classes.content}>
        <VerticalLinearStepper
          hasAccessError={props.hasAccessError}
          headsetIdError={props.headsetIdError}
          deviceError={props.deviceError}
          isClicked={props.isClicked}
          hasError={props.hasError}
        />
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
