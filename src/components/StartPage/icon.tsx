import React from 'react';
import { Error, CheckBox } from '@material-ui/icons';
import { StepLabel } from '@material-ui/core';

interface iconProps {
  hasError: boolean;
  label: string;
}

function SuccessIcon(props: iconProps) {
  if (props.hasError) {
    return (
      <div data-testid="failure">
        <StepLabel StepIconComponent={Error}>{props.label}</StepLabel>
      </div>
    );
  } else {
    return (
      <div data-testid="success">
        <StepLabel StepIconComponent={CheckBox}>{props.label}</StepLabel>
      </div>
    );
  }
}

export default SuccessIcon;
