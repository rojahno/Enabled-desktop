

import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        flexGrow: 1,
        overflow: 'auto',
        width: '100%',
    },
    listItems: {
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'center',
        transition: 'transform ease-in 0.1s',
        fontSize: '18px',
  
      },
  })
);

interface iconProps{
    hasError:boolean
}

function SuccessIcon(props:iconProps) {
    const classes = useStyles();
    
    if(props.hasError){
        return(<div>
            <button> feil</button>
          
        </div>)
    }
    else{
    return(
        <div className={classes.root}>
       <button>
           riktig
       </button>
      </div>
    )
    }
}

export default SuccessIcon;