import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, Typography, TextField, Select, Grid, Button, Hidden,
  MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';

import FormPaper from './FormPaper';


const useStyles =  makeStyles((theme) => ({
  textFieldInput: {
    width: 180,
    maxWidth: '100%',

    "& label": {
      width: '100%',
    }
  },

  dedicateSpace: {
    minHeight: 100
  }
}))

const getDate = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const year = today.getFullYear()

  return `${year}-${month}-${day}`
}

export default function EventForm(props) {
  const classes = useStyles()


  const [memberName, setMemberName] = useState('')
  const [isLeadership, setIsLeadership] = useState(0)
  const [leadershipStartDate, setLeadershipStartDate] = useState(getDate())
  const [startDate, setStartDate] = useState(getDate())

  const [submitSuccessful, setSubmitSuccessful] = useState(null)
  const [promptMessage, setPromptMessage] = useState('')


  const handleSubmit = () => {
    if (memberName === '') {
      setPromptMessage("Invalid member name!")
      setSubmitSuccessful(0)
      return
    }

    setSubmitSuccessful(1)
    setPromptMessage("Successfully submitted!")

    // do some fetching to server stuff
  }

  let leadershipDateDom;

  leadershipDateDom = !isLeadership ? null : (
    <TextField
      className={classes.textFieldInput}
      required={true}
      label="Leadership Start Date"
      type="date"
      value={leadershipStartDate}
      onChange={(e) => setLeadershipStartDate(e.target.value)}
    />
  )

  /**
   * Name
   * When join
   * Is leadership
   * When become leadership
   */
  return (
    <FormPaper
      className={props.className}
      formTitle={"Add a new member"}
      promptMessage={promptMessage}
      handleSubmit={handleSubmit}
      submitSuccess={submitSuccessful}
    >
      <Grid item xs={6}>
        <TextField
          className={classes.textFieldInput}
          required={true}
          label="Member Name"
          helperText="full name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          className={classes.textFieldInput}
          required={true}
          label="Member Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setLeadershipStartDate(e.target.value)}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLeadership}
              onChange={() => setIsLeadership(!isLeadership)}
              color="primary"
            />
          }
          label="Leadership Team"
        />
      </Grid>

      <Grid item xs={6} className={classes.dedicateSpace}>
        {leadershipDateDom}
      </Grid>
    </FormPaper>
  );
}
