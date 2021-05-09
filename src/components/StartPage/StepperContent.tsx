import React from 'react';
import { StepContent } from '@material-ui/core';

interface StepperContentProps {
  canShow: boolean;
  children: any;
}

export default function StepperContent(props: StepperContentProps) {
  if (props.canShow) {
    return (
      <StepContent>
        <div>{props.children}</div>
      </StepContent>
    );
  } else {
    return <div />;
  }
}
