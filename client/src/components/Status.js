import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

function Status({ statusCode, message }) {
  const classes = useStyles();

  return (
    <div className={classes.container}><b>{statusCode}</b> | {message}</div>
  );
}

export default Status;
