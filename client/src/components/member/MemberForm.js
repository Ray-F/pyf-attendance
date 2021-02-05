import React, { useEffect, useState } from 'react';
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


export default function MemberForm(props) {
  const classes = useStyles()

  const [isNew, setIsNew] = useState(props.memberId !== undefined)

  const [memberId, setMemberId] = useState(null)
  const [memberName, setMemberName] = useState('')

  const [startDate, setStartDate] = useState(new Date())
  const [isLeaving, setIsLeaving] = useState(false)
  const [endDate, setEndDate] = useState(new Date())

  const [submitSuccessful, setSubmitSuccessful] = useState(null)
  const [promptMessage, setPromptMessage] = useState('')


  useEffect(() => {
    if (props.memberId) {
      fetch(`/api/members?memberId=${props.memberId}`, { method: 'GET' }).then(async (promise) => {
        const res = await promise.json()

        setIsNew(false)
        setMemberId(props.memberId)
        setMemberName(res['fullName'])
        setStartDate(new Date(res['startDate']))

        if (res['endDate'] !== undefined) {
          setEndDate(new Date(res['endDate']))
          setIsLeaving(true)
        }
      })
    }
  }, [])


  const handleSubmit = () => {
    if (memberName === '') {
      setPromptMessage("Invalid member name!")
      setSubmitSuccessful(0)
      return
    }

    const memberObject = {
      _id: memberId,
      fullName: memberName,
      startDate: startDate,
    }

    if (isLeaving) {
      memberObject.endDate = endDate
    }

    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberObject)
    }

    fetch('/api/members/add', reqOptions).then(async (promise) => {
      const res = await promise

      if (res.statusCode === 500) {
        setSubmitSuccessful(0)
        setPromptMessage("Some unknown error occurred on the server")
        setTimeout(() => setPromptMessage(''), 3000)
        throw new Error("An error occurred when trying to save member")
      } else {
        if (isNew) {
          setSubmitSuccessful(1)
          setPromptMessage(`Successfully added new member: ${memberName}`)
          setTimeout(() => setPromptMessage(''), 3000)
        } else {
          setSubmitSuccessful(1)
          setPromptMessage(`Successfully edited current member: ${memberName}` )
          setTimeout(() => setPromptMessage(''), 3000)
        }
      }
    })
  }

  const handleEndDate = () => {
    if (!isLeaving) {
      console.log("Left")
      setEndDate(new Date())
    }

    setIsLeaving(!isLeaving)
  }

  let endDateDom = !isLeaving ? null : (
    <TextField
      className={classes.textFieldInput}
      required={true}
      label="Leave Date"
      type="date"
      value={getDisplayDate(endDate)}
      onChange={(e) => setEndDate(getDateFromDisplay(e.target.value))}
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
      formTitle={(props.memberId === undefined || props.memberId === null) ? "Add a new member" : `Editing ${memberName}'s record` }
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
          value={getDisplayDate(startDate)}
          onChange={(e) => setStartDate(getDateFromDisplay(e.target.value))}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLeaving}
              onChange={handleEndDate}
              color="primary"
            />
          }
          label="Known leave date"
        />
      </Grid>

      <Grid item xs={6} className={classes.dedicateSpace}>
        {endDateDom}
      </Grid>
    </FormPaper>
  );
}
