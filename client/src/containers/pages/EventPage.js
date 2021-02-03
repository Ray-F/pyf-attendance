import React from 'react';
import { makeStyles } from '@material-ui/core';
import EventForm from '../../components/event/EventForm';
import DisplayPaper from "../../components/DisplayPaper";
import EventList from "../../components/event/EventList";
import AttendanceByEventTypeOverTime from "../../components/event/graphs/AttendanceByEventTypeOverTime";
import { useLocation } from "react-router";


const useStyles = makeStyles((theme) => ({
  paper: {
    margin: '50px auto'
  }
}));

export default function EventPage(props) {
  const classes = useStyles();

  const query = new URLSearchParams(useLocation().search)

  const operation = props.match.params.operation

  switch (operation) {
    case 'add': return <EventForm className={classes.paper} eventId={query.get('eventId')} />
    case 'delete':return <DisplayPaper className={classes.paper} formTitle={"Delete event"} />
    case 'list':
    default:
      return <EventList className={classes.paper} />
  }
}
