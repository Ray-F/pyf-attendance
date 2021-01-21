import React from 'react';
import { makeStyles } from '@material-ui/core';
import AttendanceForm from "../../components/AttendanceForm";


const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto'
  }
}));

export default function AttendancePage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <AttendanceForm className={classes.form} />
    </React.Fragment>
  )
}
