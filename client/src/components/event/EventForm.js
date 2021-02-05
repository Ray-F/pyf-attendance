import React, { useEffect, useState } from 'react';
import {
  Box,
  Checkbox, FormControl, FormControlLabel, Grid, InputLabel, makeStyles,
  MenuItem, Select, TextField
} from '@material-ui/core';

import FormPaper from '../FormPaper';
import { getDateFromDisplay, getDisplayDate } from "../../utils/DateTimeUtils";
import { useHistory } from "react-router-dom";


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

  const history = useHistory()

  const [isNew, setIsNew] = useState(true)

  const [eventId, setEventId] = useState(null)
  const [eventType, setEventType] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(new Date())
  const [hasAttendanceRecords, setHasAttendanceRecords] = useState(false)

  useEffect(() => {
    if (props.eventId) {
      fetch(`/api/events?eventId=${props.eventId}`, { method : 'GET' }).then(async (promise) => {
        const res = await promise.json()

        setEventId(props.eventId)
        setIsNew(false)
        setEventType(res['type'])
        setEventDate(new Date(res['date']))
        setEventName(res['title'])
        setHasAttendanceRecords(res['hasAttendanceRecords'])
      })
    }

  }, [])

  const [submitSuccessful, setSubmitSuccessful] = useState(null)
  const [promptMessage, setPromptMessage] = useState('')

  const handleSubmit = () => {
    if (eventTypes.includes(eventType)) {
      const eventSave = {
        _id: eventId,
        title: eventName,
        type: eventType,
        date: eventDate,
        hasAttendanceRecords: hasAttendanceRecords,
      }

      const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventSave)
      }

      fetch('/api/events/add', reqOptions).then(async (promise) => {
        const res = await promise

        if (res.statusCode === 500) {

          if (isNew) {
            setSubmitSuccessful(0)
            setPromptMessage("Failed to create new event")
            setTimeout(() => setPromptMessage(''), 3000)
          } else {
            setSubmitSuccessful(0)
            setPromptMessage("Failed to edit event")
            setTimeout(() => setPromptMessage(''), 3000)
          }

          throw new Error("An error occurred when trying to save event")
        } else {

          if (isNew) {
            setSubmitSuccessful(1)
            setPromptMessage("Successfully submitted new event!")

            // After add, redirect to fill in attendance form
            fetch('/api/events', { method: 'GET' }).then(async (res) => {
              const data = await res.json()
              const lastRecord = data[data.length - 1]

              history.push(`/attendance?eventId=${lastRecord._id}`)
            })

          } else {
            setSubmitSuccessful(1)
            setPromptMessage("Successfully edited an existing event!")
            setTimeout(() => setPromptMessage(''), 3000)
          }
        }
      })

    } else {
      setSubmitSuccessful(0)
      setPromptMessage("Invalid event type!")
      setTimeout(() => setPromptMessage(''), 3000)
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
      formTitle={isNew ? "Create a new event" : "Edit an existing event" }
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
          className={classes.textFieldInput} required={true} label="Event Date" type="date" value={getDisplayDate(eventDate)}
          onChangeCapture={(e) => setEventDate(getDateFromDisplay(e.target.value))}
        />
      </Grid>

      {/*<Grid item xs={12}>*/}
      {/*  <FormControlLabel*/}
      {/*    control={*/}
      {/*      <Checkbox*/}
      {/*        checked={isCompulsory} onChange={() => {setCompulsory(!isCompulsory)}}*/}
      {/*        name="checkedB" color="primary"*/}
      {/*      />*/}
      {/*    }*/}
      {/*    label="Compulsory Attendance"*/}
      {/*  />*/}
      {/*</Grid>*/}
    </FormPaper>
  );
}
