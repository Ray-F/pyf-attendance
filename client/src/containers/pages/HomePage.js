import React from 'react';
import {
  Container, Grid, makeStyles, Typography,
} from '@material-ui/core';
import { version } from '../../../package.json';
import DashboardButton from '../../components/navigation/DashboardButton';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '50px 0',
  },

  buttonContainer: {
    margin: '20px 0',
  },
}));

export default function HomePage() {
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography variant="h4">PYF Attendance Monitor</Typography>
      <Typography variant="body1">
        Powered by Spprax Rocket (v
        {version}
        )
      </Typography>

      <Grid container className={classes.buttonContainer} spacing={2}>
        <DashboardButton link="/events" text="Events Dashboard" />
        <DashboardButton link="events/add" text="Quick Action: Add an event" />
        <DashboardButton link="/members" text="Members Dashboard" />
        <DashboardButton link="/members/add" text="Quick Action: Add a member" />
        <DashboardButton link="/attendance" text="Attendance Dashboard" />
        <DashboardButton link="/dev-dashboard" text="Development Dashboard" />
      </Grid>
    </Container>
  );
}
