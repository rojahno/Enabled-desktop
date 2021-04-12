import React from 'react';
import { Error, CheckBox } from '@material-ui/icons';
import { StepLabel } from '@material-ui/core';

interface iconProps {
  hasError: boolean;
  label: string;
}

function SuccessIcon(props: iconProps) {
  const hasError = props.hasError;
  return (
    <div data-testid="SuccessIcon">
      {hasError ? (
        <StepLabel StepIconComponent={Error}>{props.label}</StepLabel>
      ) : (
        <StepLabel StepIconComponent={CheckBox}>{props.label}</StepLabel>
      )}
    </div>
  );
}

export default SuccessIcon;
