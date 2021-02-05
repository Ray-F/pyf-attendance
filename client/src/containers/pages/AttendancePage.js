import React from 'react';
import { makeStyles } from '@material-ui/core';
import AttendanceForm from "../../components/attendance/AttendanceForm";
import { useLocation } from "react-router";


const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto'
  }
}));

export default function AttendancePage() {
  const classes = useStyles();

  const query = new URLSearchParams(useLocation().search)

  return (
    <React.Fragment>
      <AttendanceForm className={classes.form} eventId={query.get('eventId')} />
    </React.Fragment>
  )
}
