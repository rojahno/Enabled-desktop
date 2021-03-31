import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import SettingSlider from '../settings/SettingSlider';

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
      padding: '30px',
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
      <button disabled={props.isComStream} onClick={props.handleComPress}>
        Mental command stream
      </button>

      <button disabled={!props.isComStream} onClick={props.handleFacPress}>
        Facial expression stream
      </button>
      <div className={classes.buttons}>
        <Link to="/ip">
          <button>Back</button>
        </Link>
      </div>
    </SimplePaper>
  );
}
