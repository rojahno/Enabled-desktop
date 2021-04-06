import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import HelpOutlineTwoToneIcon from '@material-ui/icons/HelpOutlineTwoTone';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  root: {
    width: 300,
    textAlign: 'center',
  },
  sliderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center'
  },
  tootlips:{
    fontSize:'20px'
  }
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

interface sliderProps {
  sliderTitle: string;
  handleChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
  maxSteps: number;
  minSteps: number;
  disabled: boolean;
  tooltip: string;
}
export default function SettingSlider(props: sliderProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.sliderContainer}>
        <Typography id="discrete-slider-small-steps">
          {props.sliderTitle}
        </Typography>
        <Tooltip title={props.tooltip} className = {classes.tootlips}>
          <HelpOutlineTwoToneIcon />
        </Tooltip>
      </div>
      <Slider
        onChangeCommitted={(event, value) => props.handleChange(event, value)}
        defaultValue={5}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={1}
        marks={marks}
        min={props.minSteps}
        max={props.maxSteps}
        valueLabelDisplay="auto"
        disabled={props.disabled}
      />
    </div>
  );
}
