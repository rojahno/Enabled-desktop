import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { LoadingCircle } from './LoadingCircle';
import { useState } from 'react';

const useStyles = makeStyles({
  dialogContainer: {
    backgroundColor: 'transparent',
    boxShadow: '0',
    overflow: 'hidden',
  },
});

export interface SimpleDialogProps {
  open: boolean;
  //onClose: (value: string) => void;
}

export default function LoadingCircleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(props.open);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      className={classes.dialogContainer}
      onClose={handleClose}
      aria-labelledby=""
      open={props.open}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
        },
      }}
    >
      <LoadingCircle loading={true} delay={'0ms'} />
    </Dialog>
  );
}
