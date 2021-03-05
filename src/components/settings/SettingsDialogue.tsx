import React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import SettingSlider from './SettingSlider';
import LoadingCircle from '../LoadingCircle';


const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      backgroundColor: '#fff',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    openButton: {
      color: '#ffffff',
      textDecoration: 'underline',
      fontSize: '4',
    },
  });

//Change the style of the element
const useStyles = makeStyles(function (theme: Theme) {
  return createStyles({
    root: {
      color: '#ffffff',
      textDecoration: 'underline',
      fontSize: '4',
    },
  });
});

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        ></IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: '#fff',
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    backgroundColor: '#fff',
  },
}))(MuiDialogActions);

export default function SettingsDialogue(_props: any) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <div>
      <Link
        className={classes.root}
        component="button"
        variant="body2"
        onClick={handleClickOpen('paper')}
      >
        Settings
      </Link>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Settings
        </DialogTitle>
        <DialogContent dividers>
          <SettingSlider/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </DialogContent>
        <LoadingCircle load={true}/>
      
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
