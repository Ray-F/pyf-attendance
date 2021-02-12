import React, { useEffect, useState } from 'react';
import {
  Box, Container, Divider, Grid, Hidden, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import {
  amber, green, grey, orange, red,
} from '@material-ui/core/colors';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CapacityByEventTypeOverTime from './graphs/CapacityByEventTypeOverTime';
import { getAttendanceColour, getCapacityColour } from '../../utils/CapacityUtils';
import AttendanceByEventTypeOverTime from './graphs/AttendanceByEventTypeOverTime';
import DisplayPaper from '../DisplayPaper';
import ConfirmDialog from "../ConfirmDialog";


const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px auto',
  },

  dataGridContainer: {
    height: 650,
    width: '100%',
  },

  dataGrid: {
    minHeight: 520,
    margin: `${theme.spacing(2)}px 0`,
  },

  capacityIndicator: {
    width: 35,
    borderRadius: 100,
    height: 35,
    marginLeft: 15,
  },

  optionIconContainer: {
    margin: '0 0 0 -5px',
    display: 'flex',
  },

  graph: {
    width: '100%',
  },

  recordIndicator: {
    fontStyle: 'italic',
    color: theme.palette.primary.main,
  },

  linkWithoutAttendanceRecords: {
    color: theme.palette.primary.main,

    '&:active': {
      color: theme.palette.primary.dark,
    },
  },

  linkWithAttendanceRecords: {
    color: 'inherit',
    textDecoration: 'none',

    '&:active': {
      color: theme.palette.primary.dark,
    },

    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export default function EventList(props) {

  const classes = useStyles()
  const [events, setEvents] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [openConfirm, setOpenConfirm] = useState(false)

  const handleDelete = (eventId) => {
    fetch(`/api/events/delete?eventId=${eventId}`, { method: 'GET' }).then(async (promise) => {
      const res = await promise;

      setRefresh(refresh + 1);
    });
  };

  useEffect(() => {
    fetch('/api/events', { method: 'GET' }).then(async (promise) => {
      const eventsData = await promise.json();

      fetch('/api/attendance/all', { method: 'GET' }).then(async (promise) => {
        const data = await promise.json();

        if (eventsData === undefined) {
          await eventsData;
        }

        const eventsWithAttendanceFields = eventsData.map((event) => {
          // No attendance records, so we cannot generate statistical information
          if (!event.hasAttendanceRecords) return event;

          const attendanceForEvent = data.filter((attendance) => attendance.eventId === event._id);

          const nShouldAttend = attendanceForEvent.length;

          // If no one was supposed to turn up, we cannot generate any information
          if (nShouldAttend === 0) return event;

          let totalCapacity = 0;
          const inAttendance = attendanceForEvent.filter((attendance) => attendance.isAbsent !== true);
          inAttendance.forEach((attendance) => {
            if (event.type === 'Meeting') {
              totalCapacity += attendance.capacity;
            }
          });

          let totalAttendance = 0;

          attendanceForEvent.forEach((attendance) => {
            if (attendance.isShort) {
              totalAttendance += 0.8;
            } else if (!attendance.isAbsent) {
              totalAttendance += 1;
            }
          });

          event.averageCapacity = Math.round(totalCapacity / inAttendance.length * 100) / 100;
          event.averageAttendance = Math.round(totalAttendance / nShouldAttend * 100);

          return event;
        });

        setEvents(eventsWithAttendanceFields);
      });
    });
  }, [refresh]);

  const meetingAttendanceXY = events.filter((event) => (event.type === 'Meeting' && event.averageAttendance !== undefined))
    .map((event) => ({
      x: new Date(event.date),
      y: event.averageAttendance,
    }));

  const eventAttendanceXY = events.filter((event) => ((event.type === 'Project' || event.type === 'Training') && event.averageAttendance !== undefined))
    .map((event) => ({
      x: new Date(event.date),
      y: event.averageAttendance,
    }));

  const meetingCapacityXY = events.filter((event) => event.type === 'Meeting' && event.averageCapacity !== undefined)
    .map((event) => ({
      x0: new Date(event.date) - 1000 * 60 * 60 * 24 * 6,
      x: new Date(event.date),
      y: (5 - event.averageCapacity) * 25,
      color: Math.round(event.averageCapacity),
    }));

  const columns = [
    {
      field: 'name',
      headerName: 'Event Name',
      description: 'Name of the event',
      sortable: false,
      disableColumnMenu: true,
      width: 160,
      renderCell: (params) => {
        if (params.getValue('hasRecords')) {
          return (
            <Link className={classes.linkWithAttendanceRecords} to={`/attendance?eventId=${params.getValue('id')}`}>
              <span>{params.getValue('name')}</span>
            </Link>
          );
        }
        return (
          <Link className={classes.linkWithoutAttendanceRecords} to={`/attendance?eventId=${params.getValue('id')}`}>
            <span className={classes.recordIndicator}>{params.getValue('name')}</span>
          </Link>
        );
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      sortable: true,
      sortDirection: 'desc',
      disableColumnMenu: true,
      width: 100,
      renderCell: (params) => (
        new Date(params.getValue('date')).toLocaleDateString('en-NZ').padStart(10, '0')
      ),
    },
    // {
    //   field: 'type', headerName: 'Type',
    //   sortable: false, disableColumnMenu: true, width: 100
    // },
    {
      field: 'attendanceAvg',
      headerName: 'A %',
      description: 'average attendance for this event',
      sortable: true,
      disableColumnMenu: true,
      width: 60,
      renderCell: (params) => {
        const colour = getAttendanceColour(params.getValue('attendanceAvg'));

        return (
          <span style={{ color: colour }}>
            {params.getValue('attendanceAvg')}
            %
          </span>
        );
      },
    },
    {
      field: 'capacityAvg',
      headerName: 'Capacity',
      description: 'average capacity for this event',
      sortable: true,
      disableColumnMenu: true,
      width: 100,
      headerAlign: 'center',
      renderCell: (params) => {
        const colour = getCapacityColour(params.getValue('capacityAvg'));

        return (<Box style={{ backgroundColor: colour }} className={classes.capacityIndicator} />);
      },
    },
    {
      field: 'options', headerName: 'Options',
      disableColumnMenu: true, width: 120, headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Box className={classes.optionIconContainer}>
            <Link to={`/events/add?eventId=${params.getValue('id')}`}>
              <IconButton><EditIcon /></IconButton>
            </Link>
            <Divider orientation="vertical" flexItem />
            <IconButton onClick={() => setOpenConfirm(true)}><DeleteIcon /></IconButton>

            {/*<ConfirmDialog*/}
            {/*    title="Delete Post?"*/}
            {/*    open={openConfirm}*/}
            {/*    setOpen={setOpenConfirm}*/}
            {/*    onConfirm={handleDelete(params.getValue('id'))}*/}
            {/*/>*/}
          </Box>
        )
      }
    }
  ]

  const rows = events.map((event, index) => {
    return {
      id: event._id,
      name: event.title,
      type: event.type,
      date: event.date,
      attendanceAvg: event.averageAttendance,
      capacityAvg: event.averageCapacity,
      hasRecords: event.hasAttendanceRecords
    }
  })

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={2}>
        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>
        <Grid item xs={10} lg={6}>
          <DisplayPaper formTitle="List of events" className={classes.dataGridContainer}>
            <DataGrid
              className={classes.dataGrid}
              columns={columns}
              rows={rows}
              rowHeight={40}
              headerHeight={50}
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
                meetingData={meetingAttendanceXY}
                eventData={eventAttendanceXY}
                height={250}
              />
            </Grid>
            <Grid item xs={12}>
              <CapacityByEventTypeOverTime
                className={classes.graph}
                meetingData={meetingCapacityXY}
                height={250}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
