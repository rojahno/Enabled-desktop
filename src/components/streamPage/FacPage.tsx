import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

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

// interface ComProps{
//     isComStream:boolean
//     handleChange:(event: React.ChangeEvent<{}>,
//                 value: number | number[]) => void;
// }

export default function FacPage(props: any) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.textContainer}>
        <p>
          This stream will use the results of the facial expressions detection.
        </p>
        <p>The supported commands are: Neutral, Smile, Wink left, Wink right and Blink</p>
  
      </div>
    </div>
  );
}
