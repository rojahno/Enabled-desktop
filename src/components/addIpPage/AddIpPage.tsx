import React from 'react';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../SimplePaper';
import NavigationButtons from '../selectProfile/NavigationButtons';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import LoadingCircleDialog from '../../LoadingCircleDialog';

interface AddIpProps {
  ipAdress: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
  handleNextClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
  validIpAdress: boolean;
  openLoadingCircle:boolean;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

export default function AddIpPage(props: AddIpProps) {
  const classes = useStyles();
  return (
    <SimplePaper>
      <div className={classes.root}>
        <h3>Add the IP of your phone</h3>
        <CustomInput
          handleChange={props.handleChange}
          handleKeyPress={props.handleKeyPress}
        />
        <CustomDialog />
      </div>
      <NavigationButtons
        canNavigateForward={props.validIpAdress}
        handleNextClick={props.handleNextClick}
        backNavigation={'/select'}
      />
      <LoadingCircleDialog open={props.openLoadingCircle}/>
    </SimplePaper>
  );
}
