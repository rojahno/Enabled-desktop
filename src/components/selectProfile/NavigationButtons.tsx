import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '3px',
    },
  })
);

  interface navButtonProps {
    canNavigateForward:boolean
    handleNextClick:(event: React.MouseEvent<HTMLButtonElement>) => Promise<void>
    backNavigation:string
  }

function NavigationButtons(props:navButtonProps) {
    const classes = useStyles();
  return (
    <div className={classes.root}>
      <Link to={props.backNavigation}>
        <button>back</button>
      </Link>
      <button disabled={!props.canNavigateForward} onClick={props.handleNextClick}>
        Next
      </button>
    </div>
  );
}
export default NavigationButtons;
