import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router';
import AttendanceForm from '../../components/attendance/AttendanceForm';

const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto',
  },
}));

export default function AttendancePage() {
  const classes = useStyles();

  const query = new URLSearchParams(useLocation().search);

  return (
    <AttendanceForm className={classes.form} eventId={query.get('eventId')} />
  );
}
