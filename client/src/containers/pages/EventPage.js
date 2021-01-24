import React from 'react';
import { makeStyles } from '@material-ui/core';
import EventForm from '../../components/event/EventForm';
import DisplayPaper from "../../components/DisplayPaper";
import EventList from "../../components/event/EventList";
import AttendanceByEventTypeOverTime from "../../components/event/graphs/AttendanceByEventTypeOverTime";


const useStyles = makeStyles((theme) => ({
  paper: {
    margin: '50px auto'
  }
}));

export default function EventPage(props) {
  const classes = useStyles();

  const operation = props.match.params.operation

  switch (operation) {
    case 'add': return <EventForm className={classes.paper} />
    case 'delete':return <DisplayPaper className={classes.paper} formTitle={"Delete event"} />
    case 'list':
    default:
      return <EventList className={classes.paper} />
  }
}
