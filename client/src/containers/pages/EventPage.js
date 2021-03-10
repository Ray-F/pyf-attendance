import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router';
import EventForm from '../../components/event/EventForm';
import DisplayPaper from '../../components/wrappers/DisplayPaper';
import EventList from '../../components/event/EventList';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: '50px auto',
  },
}));

export default function EventPage(props) {
  const classes = useStyles();

  const query = new URLSearchParams(useLocation().search);

  const { operation } = props.match.params;

  switch (operation) {
    case 'add': return <EventForm className={classes.paper} eventId={query.get('eventId')} />;
    case 'delete': return <DisplayPaper className={classes.paper} formTitle="Delete event" />;
    case 'list':
    default:
      return <EventList className={classes.paper} />;
  }
}
