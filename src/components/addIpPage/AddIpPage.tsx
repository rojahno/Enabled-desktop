import React from 'react';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../utils/SimplePaper';
import NavigationButtons from '../utils/NavigationButtons';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import LoadingCircleDialog from '../utils/LoadingCircleDialog';

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
    ipContent: {
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
      <div className={classes.ipContent}>
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
