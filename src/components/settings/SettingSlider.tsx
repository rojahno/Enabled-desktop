import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { LoadingCircle } from '../LoadingCircle';

const useStyles = makeStyles({
  root: {
    width: 300,

  },
});

function valuetext(value: number) {
  return `${value}`;
}

const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
        value: 5,
        label: '5',
      },
      {
        value: 6,
        label: '6',
      },
      {
        value: 7,
        label: '7',
      },
      {
        value: 8,
        label: '8',
      },
      {
        value: 9,
        label: '9',
      },
      {
        value: 10,
        label: '10',
      },
  ];

export default function SettingSlider() {
  const classes = useStyles();

  const handleChange = async (value:number) =>{


  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        Headseth sensitivity
      </Typography>
      <Slider
      onChangeCommitted={(event,value) => console.log(value)}
        defaultValue={1}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={1}
        marks={marks}
        min={1}
        max={10}
        valueLabelDisplay="auto"
      />
      <LoadingCircle load={true}/>
    </div>
  );
}
