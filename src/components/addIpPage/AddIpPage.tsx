import React from 'react';
import CustomInput from './customInput';
import CustomDialog from './CustomDialog';
import SimplePaper from '../SimplePaper';
import NavigationButtons from '../selectProfile/NavigationButtons';

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
  return (
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
  );
}
