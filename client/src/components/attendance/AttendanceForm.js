import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Checkbox, FormControl, FormHelperText, Grid, InputLabel,
  makeStyles, MenuItem, Select, Slider, TextField, Typography, ListSubheader, Link, Button,
} from '@material-ui/core';

import { DataGrid } from '@material-ui/data-grid';
import {
  amber, green, grey, orange, red,
} from '@material-ui/core/colors';
import FormPaper from '../wrappers/FormPaper';
import { getNiceDate } from '../../utils/DateTimeUtils';

const useStyles = makeStyles((theme) => ({
  eventSelector: {
    width: 400,
    maxWidth: '100%',
  },

  dataGridContainer: {
    minHeight: 400,
    margin: `${theme.spacing(2)}px 0`,
  },

  attendanceForm: {
    maxWidth: '100%',
    width: '900px',
  },

  reasonField: {
    width: 300,
  },

  newIndicator: {
    fontSize: '0.8em',
    color: theme.palette.primary.main,
  },

  slider: {
    '&[data-capacity="4"]': {
      '& .MuiSlider-rail': {
        backgroundColor: red[500],
      },

      '& .MuiSlider-track': {
        backgroundColor: red[500],
      },

      '& .MuiSlider-thumb': {
        backgroundColor: red[700],
      },
    },

    "&[data-capacity='3']": {
      '& .MuiSlider-rail': {
        backgroundColor: orange[500],
      },

      '& .MuiSlider-track': {
        backgroundColor: orange[500],
      },

      '& .MuiSlider-thumb': {
        backgroundColor: orange[700],
      },
    },

    "&[data-capacity='2']": {
      '& .MuiSlider-rail': {
        backgroundColor: amber[500],
      },

      '& .MuiSlider-track': {
        backgroundColor: amber[500],
      },

      '& .MuiSlider-thumb': {
        backgroundColor: amber[700],
      },
    },

    "&[data-capacity='1']": {
      '& .MuiSlider-rail': {
        backgroundColor: green[400],
      },

      '& .MuiSlider-track': {
        backgroundColor: green[400],
      },

      '& .MuiSlider-thumb': {
        backgroundColor: green[600],
      },
    },

    '&.Mui-disabled': {
      '& .MuiSlider-rail': {
        backgroundColor: `${grey[500]} !important`,
      },

      '& .MuiSlider-track': {
        backgroundColor: `${grey[500]} !important`,
      },

      '& .MuiSlider-thumb': {
        backgroundColor: `${grey[700]} !important`,
      },
    },
  },
}));

const findOldAndNew = (attendanceData, params) => {
  const currentEntry = attendanceData.find((entry) => (entry.id === params.getValue('id')));
  const oldEntries = attendanceData.filter((member) => (member.id !== params.getValue('id')));

  return [currentEntry, oldEntries];
};

export default function AttendanceForm(props) {
  const classes = useStyles();

  const history = useHistory();

  const [attendanceData, setAttendanceData] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);

  const [submitSuccessful, setSubmitSuccessful] = useState(null);
  const [promptMessage, setPromptMessage] = useState(null);

  // Max number of dropdown items to display in event selection list
  const listLength = 10;

  // Refresh list of events
  useEffect(() => {
    // Extra string to append to fetch url if we want to pass an event to fetch information for as well
    const fetchUrlAddition = props.eventId ? `&eventId=${props.eventId}` : '';

    fetch(`/api/events/list?listLength=${listLength}${fetchUrlAddition}`, { method: 'GET' }).then(async (res) => {
      const data = await res.json();
      setRecentEvents(data);
      setAttendanceData([]);
    });
  }, [submitSuccessful]);

  useEffect(() => {
    if (props.eventId) {
      const foundEvent = recentEvents.find((event) => event._id === props.eventId);

      if (foundEvent) {
        setCurrentEvent(foundEvent);
      } else {
        // Get the corresponding event and set it to current event
        fetch(`/api/events?eventId=${props.eventId}`, { method: 'GET' }).then(async (res) => {
          const data = await res.json();
          setCurrentEvent(data);
        });
      }

      // Get the corresponding attendance data and set
      fetch(`/api/attendance?eventId=${props.eventId}`, { method: 'GET' }).then(async (res) => {
        const data = await res.json();
        setAttendanceData(data);
      });
    }
  }, []);

  const handleCurrentEventChange = (eventId) => {
    const selectedEvent = recentEvents.find((event) => event._id === eventId);

    if (selectedEvent) {
      setAttendanceData([]);
      setCurrentEvent(selectedEvent);
      fetch(`/api/attendance?eventId=${eventId}`, { method: 'GET' }).then(async (res) => {
        const data = await res.json();
        setAttendanceData(data);
      });
    }
  };

  const handleAbsentChange = (params) => {
    const [currentEntry, oldEntries] = findOldAndNew(attendanceData, params);
    currentEntry.isAbsent = !currentEntry.isAbsent;

    // Set late/left early toggle to off if member is absent
    if (currentEntry.isAbsent) currentEntry.isShort = false;

    setAttendanceData([currentEntry, ...oldEntries]);
  };

  const handleShortChange = (params) => {
    const [currentEntry, oldEntries] = findOldAndNew(attendanceData, params);
    currentEntry.isShort = !currentEntry.isShort;
    setAttendanceData([currentEntry, ...oldEntries]);
  };

  const handleExcuseChange = (params) => {
    const [currentEntry, oldEntries] = findOldAndNew(attendanceData, params);
    currentEntry.isExcused = !currentEntry.isExcused;
    setAttendanceData([currentEntry, ...oldEntries]);
  };

  const handleExcuseReasonChange = (newReason, params) => {
    const [currentEntry, oldEntries] = findOldAndNew(attendanceData, params);

    currentEntry.excuseReason = newReason;
    setAttendanceData([currentEntry, ...oldEntries]);
  };

  const handleCapacityChange = (newCapacity, params) => {
    const [currentEntry, oldEntries] = findOldAndNew(attendanceData, params);
    currentEntry.capacity = newCapacity;
    setAttendanceData([currentEntry, ...oldEntries]);
  };

  const handleSubmit = () => {
    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceData),
    };

    fetch('/api/attendance', reqOptions).then(async (promise) => {
      const res = await promise;

      if (res.statusCode === 500) {
        throw new Error('An error occurred when trying to save attendance data');
      } else {
        setSubmitSuccessful(submitSuccessful + 1);
        setPromptMessage('Successfully submitted attendance form!');

        setTimeout(() => {
          setPromptMessage('');
          history.replace('/events');
        }, 1500);
      }
    });
  };

  const columns = [
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'Full name of the member',
      sortable: false,
      sortDirection: 'asc',
      disableColumnMenu: true,
      width: 160,
    },
    {
      field: 'isAbsent',
      headerName: 'Absent',
      description: 'Tick if the member was absent',
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Checkbox checked={params.getValue('isAbsent')} onClick={() => handleAbsentChange(params)} />
      ),
    },
    {
      field: 'isShort',
      headerName: 'Early/Late',
      description: 'Tick if the member left early or came late',
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={params.getValue('isShort')}
          disabled={params.getValue('isAbsent')}
          onClick={() => handleShortChange(params)}
        />
      ),
    },
    {
      field: 'isExcused',
      headerName: 'Excused',
      description: 'Tick if the member has a reasonable reason for absence / leave that is justified',
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={params.getValue('isExcused')}
          onClick={() => handleExcuseChange(params)}
          disabled={!params.getValue('isAbsent') && !params.getValue('isShort')}
        />
      ),
    },
    {
      field: 'excuseReason',
      headerName: 'Reason',
      width: 250,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <TextField
          className={classes.reasonField}
          disabled={!params.getValue('isExcused')}
          defaultValue={params.getValue('excuseReason')}
          onBlur={(e) => handleExcuseReasonChange(e.target.value, params)}
        />
      ),
    },
  ];

  if (currentEvent.type === 'Meeting') {
    columns.splice(2, 0,
      {
        field: 'capacityCheck',
        headerName: 'Capacity',
        width: 120,
        disableColumnMenu: true,
        sortable: false,

        renderCell: (params) => (
          <Slider
            className={classes.slider}
            onChangeCommitted={(e, value) => handleCapacityChange(value, params)}
            disabled={params.getValue('isAbsent')}
            step={1}
            min={1}
            max={4}
            defaultValue={params.row.capacity}
            data-capacity={params.row.capacity}
          />
        ),
      });
  }

  const handleSeeAll = () => {
    history.push('/events');
  };

  // Checks if there are any Not Submitted events, and displays a section header for the dropdown list, if there are.
  let submitHeader;
  if (recentEvents.some((event) => !event.hasAttendanceRecords)) {
    submitHeader = <ListSubheader>Need to Submit</ListSubheader>;
  }

  /**
   * Fetches list of events, select event on that day (must be on the same day, or future event)
   */
  return (
    <FormPaper
      className={`${props.className} ${classes.attendanceForm}`}
      formTitle="Attendance Tracker"
      submitSuccess={submitSuccessful}
      promptMessage={promptMessage}
      handleSubmit={handleSubmit}
    >
      <Grid item xs={12}>
        <FormControl required className={classes.eventSelector}>
          <InputLabel id="">Select event</InputLabel>
          <Select
            value={currentEvent._id ? currentEvent._id : ''}
            onChange={(e) => handleCurrentEventChange(e.target.value)}
          >
            {submitHeader}

            {recentEvents.map((event, index) => {
              if (!event.hasAttendanceRecords) {
                return (
                  <MenuItem
                    value={event._id}
                    key={index}
                  >
                    {event.title}
                    {' '}
                    –
                    {getNiceDate(event.date)}
&nbsp;
                    <i className={classes.newIndicator}>{event.hasAttendanceRecords ? '' : 'to submit'}</i>
                  </MenuItem>
                );
              }
              return (<></>);
            })}

            <ListSubheader>
              Recent Events (
              <Link onClick={handleSeeAll}>see more</Link>
              )
            </ListSubheader>

            {recentEvents.map((event, index) => {
              if (event.hasAttendanceRecords) {
                return (
                  <MenuItem
                    value={event._id}
                    key={index}
                  >
                    {event.title}
                    {' '}
                    –
                    {getNiceDate(event.date)}&nbsp;
                    <i className={classes.newIndicator}>{event.hasAttendanceRecords ? '' : 'to submit'}</i>
                  </MenuItem>
                );
              }
              return (<></>);
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.dataGridContainer}>
          <DataGrid
            columns={columns}
            rows={attendanceData}
            rowHeight={38}
            headerHeight={50}
          />
        </Box>
        <Typography variant="body2"><i>Note: Options will open up depending on input combinations</i></Typography>
      </Grid>
    </FormPaper>
  );
}
