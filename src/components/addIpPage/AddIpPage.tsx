import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../SimplePaper';
import NavigationButtons from '../selectProfile/NavigationButtons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

interface AddIpProps {
  ipAdress: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
  handleNextClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
  validIpAdress: boolean;
}

export default function AddIpPage(props: AddIpProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Add the IP of your phone</h3>
          <CustomInput
            handleChange={props.handleChange}
            handleKeyPress={props.handleKeyPress}
          />
          <CustomDialog />
          <NavigationButtons
            canNavigateForward={props.validIpAdress}
            handleNextClick={props.handleNextClick}
            backNavigation={'/select'}
          />
        </SimplePaper>
      </div>
    </div>
  );
}
