import React from 'react';

interface StepperContentProps {
  showContent: boolean;
  children: any;
}
/**
 * The stepper content components. Shows the props or returns an empty div.
 */
export default function StepperContent(props: StepperContentProps) {
  if (props.showContent) {
    return <p >{props.children}</p>;
  } else {
    return <div />;
  }
}
