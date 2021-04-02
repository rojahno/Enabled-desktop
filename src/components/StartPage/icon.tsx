

import React, { ReactElement, useState } from 'react';
import { Theme, createStyles, makeStyles, styled } from '@material-ui/core/styles';
import { Error, CheckBox, Adjust } from '@material-ui/icons';
import { IconProps, StepIconProps, StepLabel } from '@material-ui/core';

// const StyledStepLabel = styled(StepLabel)({
//     '& .MuiStepLabel-label': {
//       color: '#fff',
//     },
//   });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      successIcon: {
        color: 'green',
      },
      errorIcon: {
        color: 'red',
  }
}
));

interface iconProps{
    hasError:boolean 
    label: string
}



//     return <div>{icons[String(props.icon)]}</div>
// }
function SuccessIcon(props:iconProps) {
    const classes = useStyles();

    
    if(props.hasError){
        return (
        <div>
        <StepLabel StepIconComponent={Error}>
        {props.label}
        </StepLabel>
        </div>
      )

    }
    else{
        return (
            <div>
            <StepLabel StepIconComponent={CheckBox}>
            {props.label}
            </StepLabel>
            </div>
          )
    
        }
    }


export default SuccessIcon;