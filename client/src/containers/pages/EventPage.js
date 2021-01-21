import React from 'react';
import { makeStyles } from '@material-ui/core';
import EventForm from '../../components/EventForm';


const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto'
  }
}));

export default function EventPage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <EventForm className={classes.form} />
    </React.Fragment>
  )
}
