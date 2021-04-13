import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'grey',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
        '&.MuiTextField-root': {},
      },
    },
  },
})(TextField);

//Change the style of the element
const useStyles = makeStyles(function (theme: Theme) {
  return createStyles({
    root: {
      margin: theme.spacing(2),
      width: theme.spacing(23),
      textAlign: 'center',
    },
  });
});

export interface inputProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}

const CustomInput = (props: inputProps) => {
  const classes = useStyles();

  return (
    <CssTextField
    data-testid="input"
      className={classes.root}
      error={false}
      hiddenLabel={true}
      inputProps={{ min: 0, style: { textAlign: 'center' } }}
      placeholder="127.0.0.1"
      label=" "
      onChange={props.handleChange}
      onKeyPress={props.handleKeyPress}
    />
  );
};
export default CustomInput;
