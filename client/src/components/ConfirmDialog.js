import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core';

const Transition = React.forwardRef((props, ref) => (<Slide direction="up" ref={ref} {...props} />))

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    padding: theme.spacing(3),
  }
}));

export default function ConfirmDialog(props) {
  const {
    title, children, open, setOpen, onConfirm,
  } = props;

  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      TransitionComponent={Transition}
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent><DialogContentText id="alert-dialog-slide-description">{children}</DialogContentText></DialogContent>
      <DialogActions className={classes.buttonContainer}>
        <Button variant="contained" onClick={() => setOpen(false)} color="secondary">No</Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="default"
        >Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
