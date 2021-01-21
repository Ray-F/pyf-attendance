import React from 'react';
import { makeStyles } from '@material-ui/core';
import MemberForm from '../../components/MemberForm';


const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto'
  }
}));

export default function MemberPage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <MemberForm className={classes.form} />
    </React.Fragment>
  )
}