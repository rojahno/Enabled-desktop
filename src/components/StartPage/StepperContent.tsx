import React from 'react';

interface StepperContentProps {
  showContent: boolean;
  children: any;
}

export default function StepperContent(props: StepperContentProps) {
  if (props.showContent) {
    return <p >{props.children}</p>;
  } else {
    return <div />;
  }
}
