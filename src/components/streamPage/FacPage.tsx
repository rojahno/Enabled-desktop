import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import StreamIndicator from './StreamIndicator';

const useStyles = makeStyles(() =>
  createStyles({
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: '15px',
      padding: '15px',
    },
  })
);
interface Facprops {
  hasConnection: boolean;
}
/**
 * The pac page component.
 */
export default function FacPage(props: Facprops) {
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
