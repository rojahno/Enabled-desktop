import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignSelf: 'flex-end',
      width: '100%',
    },
  })
);

interface navButtonProps {
  canNavigateForward: boolean;
  handleNextClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
  backNavigation: string;
}

function NavigationButtons(props: navButtonProps) {
  const classes = useStyles();
  const history = useHistory();

  function navigateBack() {
    history.push({ pathname: props.backNavigation });
  }

  return (
    <div className={classes.root}>
      <button data-testid="backButton" onClick={navigateBack}>
        Back
      </button>

      <button
        data-testid="nextButton"
        disabled={!props.canNavigateForward}
        onClick={props.handleNextClick}
      >
        Next
      </button>
    </div>
  );
}
export default NavigationButtons;
