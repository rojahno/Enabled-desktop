import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import SettingSlider from '../settings/SettingSlider';
import CortexError from '../../modules/CortexError';
import { Tab, Tabs } from '@material-ui/core';
import CustomStreamDialog from './CustomStreamDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    buttons: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      width: '100%',
      height: '100%',
      padding: '3px',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: '15px',
      padding: '15px',
    },
    dialog: {
      paddingTop: '10px',
    },
  })
);

interface StreamProps {
  handleChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
  handleComPress: () => void;
  handleFacPress: () => void;
  isComStream: boolean;
}

export default function StreamPage(props: StreamProps) {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    console.log('value is: ' + value);
  };

  return (
    <SimplePaper>
      <h3>Stream:</h3>
      <SettingSlider
        sliderTitle={'Headset sensitivity'}
        handleChange={props.handleChange}
        minSteps={1}
        maxSteps={10}
        disabled={!props.isComStream}
      />
      <div className={classes.textContainer}>
        <p>
          Moving the slider to the right (10) will make it easier to trigger.
          Moving the slider to the left (1) will make the commands harder to
          trigger.
        </p>
      </div>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Command Stream" onClick={props.handleComPress} />
        <Tab label="Expression Stream" onClick={props.handleFacPress} />
      </Tabs>
      <div className={classes.dialog}>
        <CustomStreamDialog />
      </div>
      <div className={classes.buttons}>
        <Link to="/ip">
          <button>Back</button>
        </Link>
      </div>
    </SimplePaper>
  );
}
