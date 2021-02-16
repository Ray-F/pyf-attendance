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

export default function DevelopmentPage() {
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography variant="h4">PYF Development Dashboard</Typography>
      <Typography variant="body1">Please be cautious, items on this page can have impacts on the development environment.</Typography>

      <Grid container className={classes.buttonContainer} spacing={2}>
        {buttonFactory(null, 'Clone Production Database to Dev', () => fetch('/api/reset-db', { method: 'GET' }))}
      </Grid>
    </Container>
  );
}
