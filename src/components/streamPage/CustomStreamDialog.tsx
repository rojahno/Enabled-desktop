import React, { useState } from 'react';
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
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { DialogContentText, Divider } from '@material-ui/core';
import iphoneSettings from './../../images/iphone-settings.png';
import iphoneWifi from './../../images/iphone-settings-wifi.png';
import iphoneAbout from './../../images/iphone-settings-about.png';

export interface CustomStreamDialogProps{
    onClose:() => void;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
const useStyles = makeStyles(function (theme: Theme) {
    return createStyles({
      root: {
        color: '#ffffff',
        textDecoration: 'underline',
        fontSize: '4',
      },
      dialogContent: {
        minWidth: '50vw',
        overflowX: 'hidden',
      },
      contentText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      imageContainer: {
        width: '60%',
      },
  
      image: {
        width: '100%',
        paddingRight: '15px',
      },
      divider: {
        margin: '15px',
      },
    });
  });

  export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
  }
  

  
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
                >
                <CloseIcon />{' '}
              </IconButton>
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
      
    export default function CustomStreamDialog(props:any){
        const classes = useStyles();
        const [open,setOpen] = useState(false)
    
        const handleClickOpen = () =>{
            setOpen(true)
        }
    
        const handleClose = () =>{
            setOpen(false)
        }
    
    return(
        <div>
          <Link
          className = {classes.root}
          component = "button"
          variant = "body2"
          onClick = {handleClickOpen}
          >
              {<HelpOutlineIcon color='primary' />}
          </Link>
          <Dialog
          onClose = {handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                  Explaination of Command stream v. Expression stream

              </DialogTitle>
              <DialogContent dividers>
                The difference when it comes to command stream and expression stream is......
              </DialogContent>
              <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            ok
          </Button>
        </DialogActions>
          </Dialog>
      </div>
  )
}