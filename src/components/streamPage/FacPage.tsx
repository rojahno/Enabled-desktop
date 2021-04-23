import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import StreamIndicator from './StreamIndicator';

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
interface Facprops {
  hasConnection: boolean;
}
export default function FacPage(props:Facprops) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.textContainer}>
        <StreamIndicator isLive={props.hasConnection} />
        <p>
          The supported commands are: Neutral, Smile, Wink left, Wink right and
          Raise brows
        </p>
      </div>
    </div>
  );
}
