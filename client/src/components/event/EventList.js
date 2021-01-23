import React, { useEffect, useState } from 'react'
import DisplayPaper from "../DisplayPaper";
import { Box, Card, CardActions, CardContent, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import AttendanceByEventTypeOverTime from "./graphs/AttendanceByEventTypeOverTime";


const useStyles = makeStyles((theme) => ({
  container: {
    margin: "50px auto"
  },

  card: {
    display: 'block',
    width: '100%',
    marginBottom: theme.spacing(2),
    position: 'relative',

    "&:hover": {
      boxShadow: '0 0 2px grey'
    }
  },

  inlineContainer: {
    display: 'inline'
  },

  status: {
    textAlign: 'right'
  },

  newIndicator: {
    marginLeft: '10px',
    fontSize: '0.8em',
    color: theme.palette.primary.main
  },

  cardContentArea: {
  },

  cardActionArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: 100,
    background: '#f0f0f6'
  },

  graph: {
    width: '100%'
  }
}));

export default function EventList(props) {
  const classes = useStyles()
  const [events, setEvents] = useState([])

  useEffect(() => {

    fetch('/api/events', { method: 'GET' }).then(async (promise) => {
      const eventsData = await promise.json()

      fetch('/api/attendance/all', { method: 'GET' }).then(async (promise) => {
        const data = await promise.json()

        if (eventsData === undefined) {
          await eventsData
        }

        const eventsWithAttendanceFields = eventsData.map((event) => {
          // No attendance records, so we cannot generate statistical information
          if (!event.hasAttendanceRecords) return event

          const attendanceForEvent = data.filter((attendance) => attendance.eventId === event._id)

          // If no one was supposed to turn up, we cannot generate any information
          const nAttendance = attendanceForEvent.length
          if (nAttendance === 0) return event

          let totalAttendance = 0
          let totalCapacity = 0

          attendanceForEvent.forEach((attendance) => {
            if (event.type === "Meeting") {
              totalCapacity += attendance.capacity
            }

            if (attendance.isShort) {
              totalAttendance += 0.8
            } else if (!attendance.isAbsent) {
              totalAttendance += 1
            }
          })

          event.averageCapacity = Math.round(totalCapacity / nAttendance * 100) / 100
          event.averageAttendance = Math.round(totalAttendance / nAttendance * 100)

          return event
        })

        setEvents(eventsWithAttendanceFields)
      })
    })
  }, [])

  const meetingAttendanceXY = events.filter((event) => (event.type === "Meeting" && event.averageAttendance !== undefined))
    .map((event) => {
      return {
        x: new Date(event.date),
        y: event.averageAttendance
      }
    })

  const eventAttendanceXY = events.filter((event) => (event.type === "Project" && event.averageAttendance !== undefined))
    .map((event) => {
      return {
        x: new Date(event.date),
        y: event.averageAttendance
      }
    })

  return (
    <Container maxWidth={'lg'} className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <DisplayPaper formTitle={"List of events"}>
            {events.map((event, index) => {
              return (
                <Card key={index} className={classes.card} variant={'outlined'} raised={false}>
                  <CardContent className={classes.cardContentArea} data-to-submit={!event.hasAttendanceRecords}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography className={classes.inlineContainer} variant={'h6'}>{event.title}</Typography>
                        <i className={classes.newIndicator}>{!(event.hasAttendanceRecords) ? "Yet to submit" : ""}</i>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant={'body2'}>{new Date(event.date).toDateString()}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant={'body2'}>{event.type}</Typography>
                        <Typography variant={'body2'}><b>{event.averageAttendance}% attendance – capacity level {event.averageCapacity}</b></Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions className={classes.cardActionArea}>

                  </CardActions>
                </Card>
              )
            })}
          </DisplayPaper>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AttendanceByEventTypeOverTime
                className={classes.graph}
                meetingData={meetingAttendanceXY} eventData={eventAttendanceXY} height={300}
              />
            </Grid>
            <Grid item xs={12}>
              <AttendanceByEventTypeOverTime
                className={classes.graph}
                meetingData={meetingAttendanceXY} eventData={eventAttendanceXY} height={300}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}