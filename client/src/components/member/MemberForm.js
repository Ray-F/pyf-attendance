import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Grid, makeStyles, TextField } from '@material-ui/core';

import FormPaper from '../FormPaper';
import { getDateFromDisplay, getDisplayDate } from "../../utils/DateTimeUtils";


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

export default function MemberForm(props) {
  const classes = useStyles()

  const [memberName, setMemberName] = useState('')
  const [isLeadership, setIsLeadership] = useState(false)
  const [leadershipStartDate, setLeadershipStartDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())

  const [submitSuccessful, setSubmitSuccessful] = useState(null)
  const [promptMessage, setPromptMessage] = useState('')


  const handleSubmit = () => {
    if (memberName === '') {
      setPromptMessage("Invalid member name!")
      setSubmitSuccessful(0)
      return
    }

    const memberObject = {
      fullName: memberName,
      startDate: startDate,
      isLeadership: isLeadership,
      leadershipStartDate: leadershipStartDate
    }

    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberObject)
    }

    fetch('/api/members/add', reqOptions).then(async (promise) => {
      const res = await promise

      if (res.statusCode == 500) {
        setSubmitSuccessful(0)
        setPromptMessage("Some unknown error occurred on the server")
        setTimeout(() => setPromptMessage(''), 3000)
        throw new Error("An error occurred when trying to save new event")
      } else {
        setSubmitSuccessful(1)
        setPromptMessage("Successfully added new member")
        setTimeout(() => setPromptMessage(''), 3000)
      }
    })

    // do some fetching to server stuff
  }

  let leadershipDateDom;

  leadershipDateDom = !isLeadership ? null : (
    <TextField
      className={classes.textFieldInput}
      required={true}
      label="Leadership Start Date"
      type="date"
      defaultValue={getDisplayDate(leadershipStartDate)}
      onChange={(e) => setLeadershipStartDate(getDateFromDisplay(e.target.value))}
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
          defaultValue={getDisplayDate(startDate)}
          onChange={(e) => setStartDate(getDateFromDisplay(e.target.value))}
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
