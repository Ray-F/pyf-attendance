import React, { useEffect, useState } from 'react'
import DisplayPaper from "../DisplayPaper";
import { Box, Container, Divider, Grid, Hidden, IconButton, makeStyles, Typography } from "@material-ui/core";
import AttendanceByEventTypeOverTime from "./graphs/AttendanceByEventTypeOverTime";
import { DataGrid } from "@material-ui/data-grid";
import { amber, green, grey, orange, red } from "@material-ui/core/colors";

import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit';
import CapacityByEventTypeOverTime from "./graphs/CapacityByEventTypeOverTime";
import { getAttendanceColours, getCapacityColour } from "../../utils/CapacityUtils";


const useStyles = makeStyles((theme) => ({
  container: {
    margin: "50px auto"
  },

  dataGridContainer: {
    height: 650,
    width: '100%'
  },

  dataGrid: {
    minHeight: 520,
    margin: `${theme.spacing(2)}px 0`
  },

  capacityIndicator: {
    width: 35,
    borderRadius: 100,
    height: 35,
    marginLeft: 15
  },

  optionIconContainer: {
    margin: '0 0 0 -5px',
    display: 'flex'
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

          const nShouldAttend = attendanceForEvent.length

          // If no one was supposed to turn up, we cannot generate any information
          if (nShouldAttend === 0) return event

          let totalCapacity = 0
          const inAttendance = attendanceForEvent.filter((attendance) => attendance.isAbsent !== true)
          inAttendance.forEach((attendance) => {
              if (event.type === "Meeting") {
                totalCapacity += attendance.capacity
              }
            }
          )

          let totalAttendance = 0

          attendanceForEvent.forEach((attendance) => {
            if (attendance.isShort) {
              totalAttendance += 0.8
            } else if (!attendance.isAbsent) {
              totalAttendance += 1
            }
          })

          event.averageCapacity = Math.round(totalCapacity / inAttendance.length * 100) / 100
          event.averageAttendance = Math.round(totalAttendance / nShouldAttend * 100)

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

  const meetingCapacityXY = events.filter((event) => event.type === "Meeting" && event.averageCapacity !== undefined)
    .map((event) => {
      return {
        x0: new Date(event.date) - 1000 * 60 * 60 * 24 * 6,
        x: new Date(event.date),
        y: (5 - event.averageCapacity) * 25,
        color: Math.round(event.averageCapacity)
      }
    })

  const columns = [
    {
      field: 'name', headerName: 'Event Name', description: 'Name of the event',
      sortable: false, disableColumnMenu: true, width: 160
    },
    {
      field: 'date', headerName: 'Date',
      sortable: true, sortDirection: 'desc', disableColumnMenu: true, width: 100,
      renderCell: (params) => (
        new Date(params.getValue('date')).toLocaleDateString('en-NZ').padStart(10, '0')
      )
    },
    // {
    //   field: 'type', headerName: 'Type',
    //   sortable: false, disableColumnMenu: true, width: 100
    // },
    {
      field: 'attendanceAvg', headerName: 'A %',
      sortable: true, disableColumnMenu: true, width: 60,
      renderCell: (params) => {
        const colour = getAttendanceColours(params.getValue('attendanceAvg'))

        return (<span style={{color: colour}}>{params.getValue('attendanceAvg')}%</span>)
      }
    },
    {
      field: 'capacityAvg', headerName: 'Capacity',
      sortable: true, disableColumnMenu: true, width: 100, headerAlign: 'center',
      renderCell: (params) => {
        const colour = getCapacityColour(params.getValue('capacityAvg'))

        return (<Box style={{ backgroundColor: colour }} className={classes.capacityIndicator} />)
      }
    },
    {
      field: 'options', headerName: 'Options',
      disableColumnMenu: true, width: 120, headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Box className={classes.optionIconContainer}>
            <IconButton><EditIcon /></IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton><DeleteIcon /></IconButton>
          </Box>


        )
      }
    }
  ]

  const rows = events.map((event, index) => {
    return {
      id: index,
      name: event.title,
      type: event.type,
      date: event.date,
      attendanceAvg: event.averageAttendance,
      capacityAvg: event.averageCapacity
    }
  })

  return (
    <Container maxWidth={'lg'} className={classes.container}>
      <Grid container spacing={2}>
        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>
        <Grid item xs={10} lg={6}>
          <DisplayPaper formTitle={"List of members"} className={classes.dataGridContainer}>
            <DataGrid className={classes.dataGrid}
                      columns={columns} rows={rows}
                      rowHeight={40} headerHeight={50}
                      pageSize={10}
            />
          </DisplayPaper>
        </Grid>

        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>

        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>

        <Grid item xs={10} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AttendanceByEventTypeOverTime
                className={classes.graph}
                meetingData={meetingAttendanceXY} eventData={eventAttendanceXY} height={250}
              />
            </Grid>
            <Grid item xs={12}>
              <CapacityByEventTypeOverTime
                className={classes.graph}
                meetingData={meetingCapacityXY} height={250}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}