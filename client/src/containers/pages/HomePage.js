import React from 'react';
import {
  Container, Grid, makeStyles, Typography,
} from '@material-ui/core';
import { version } from '../../../package.json';
import buttonFactory from '../../utils/ButtonFactoryUtils';

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
        {buttonFactory('/events', 'Events Dashboard')}
        {buttonFactory('/events/add', 'Quick Action: Add an event')}
        {buttonFactory('/members', 'Members Dashboard')}
        {buttonFactory('/members/add', 'Quick Action:\n Add a member')}
        {buttonFactory('/attendance', 'Attendance Dashboard')}
        {buttonFactory('/development', 'Development Dashboard')}
      </Grid>
    </Container>
  );
}
