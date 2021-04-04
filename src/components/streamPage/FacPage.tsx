import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import SettingSlider from '../settings/SettingSlider';
import CortexError from '../../modules/CortexError';
import { Tab, Tabs } from '@material-ui/core';
import CustomStreamDialog from './CustomStreamDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    buttons: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      width: '100%',
      height: '100%',
      padding: '3px',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: '15px',
      padding: '15px',
    },
    dialog: {
      paddingTop: '10px',
    },
  })
);

// interface ComProps{
//     isComStream:boolean
//     handleChange:(event: React.ChangeEvent<{}>,
//                 value: number | number[]) => void;
// }

export default function ComPage(props: any){
    const classes = useStyles();

    return(
        <div>
      <div className={classes.textContainer}>
        <p>
          Moving the slider to the right (10) will make it easier to trigger.
          Moving the slider to the left (1) will make the commands harder to
          trigger.
        </p>
      </div>
        </div>
    )
}