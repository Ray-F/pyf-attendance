import React, { useState } from 'react';
import {
  Checkbox, FormControl, FormControlLabel, Grid, InputLabel, makeStyles,
  MenuItem, Select, TextField
} from '@material-ui/core';

import FormPaper from '../FormPaper';
import { getDateFromDisplay, getDisplayDate } from "../../utils/DateTimeUtils";


const useStyles =  makeStyles((theme) => ({
  textFieldInput: {
    width: 180,
    maxWidth: '100%',

    "& label": {
      width: '100%',
    }
  }
}))

export default function EventForm(props) {
  const classes = useStyles()

  const eventTypes = [
    'Meeting',
    'Training',
    'Project'
  ]

  const [isCompulsory, setCompulsory] = useState(false)
  const [eventType, setEventType] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(new Date())

  const [submitSuccessful, setSubmitSuccessful] = useState(null)
  const [promptMessage, setPromptMessage] = useState('')

  const handleSubmit = () => {
    if (eventTypes.includes(eventType)) {
      setSubmitSuccessful(1)
      setPromptMessage("Successfully submitted!")

      const eventSave = {
        title: eventName,
        type: eventType,
        date: eventDate,
        compulsory: isCompulsory
      }

      const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventSave)
      }

      fetch('/api/events/add', reqOptions).then(async (promise) => {
        const res = await promise

        if (res.statusCode === 500) {
          throw new Error("An error occurred when trying to save new event")
        } else {
          setSubmitSuccessful(1)
          setPromptMessage("Successfully submitted new event!")
        }
      })
    } else {
      setSubmitSuccessful(0)
      setPromptMessage("Invalid event type!")
    }
  }

  const handleEventTypeChange = (value) => {
    setEventType(value)

    if (value === "Meeting") setEventName("General Meeting")
    else {
      setEventName("")
    }
  }

  return (
    <FormPaper
      className={props.className}
      formTitle={"Create a new event"}
      handleSubmit={handleSubmit}
      promptMessage={promptMessage}
      submitSuccess={submitSuccessful}
    >
      <Grid item xs={6}>
        <FormControl required={true} className={classes.textFieldInput}>
          <InputLabel id="">Event Type</InputLabel>
          <Select onChange={(e) => handleEventTypeChange(e.target.value)} value={eventType}>
            {eventTypes.map((event, index) => (<MenuItem value={event} key={index}>{event}</MenuItem>))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          className={classes.textFieldInput} label='Event Name'
          value={eventName} onChange={(e) => setEventName(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          className={classes.textFieldInput} required={true} label="Event Date" type="date"
          value={getDisplayDate(eventDate)} onChange={(e) => setEventDate(getDateFromDisplay(e.target.value))}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isCompulsory} onChange={() => {setCompulsory(!isCompulsory)}}
              name="checkedB" color="primary"
            />
          }
          label="Compulsory Attendance"
        />
      </Grid>
    </FormPaper>
  );
}
