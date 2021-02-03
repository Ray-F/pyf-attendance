import React from 'react'
import { Button, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '50px 0'
  },

  buttonContainer: {
    margin: '20px 0'
  },

  link: {
    textDecoration: 'none'
  },

  actionButton: {
    width: '200px',
    height: '100px',
    maxWidth: '100%'
  }
}))

export default function HomePage() {
  const classes = useStyles()

  function buttonFactory(link, text) {
    return (
      <Grid item xs={6} sm={4}>
        <Link to={link} className={classes.link}>
          <Button className={classes.actionButton} variant={'outlined'} color={'primary'}>{text}</Button>
        </Link>
      </Grid>
    )
  }

  return (
    <Container className={classes.container} maxWidth={'md'}>
      <Typography variant={'h4'}>PYF Attendance Monitor</Typography>
      <Typography variant={'body1'}>Powered by Spprax Rocket</Typography>

      <Grid container className={classes.buttonContainer} spacing={2}>
        {buttonFactory("/events", "Events Dashboard")}
        {buttonFactory("/events/add", "Quick Action: Add an event")}
        {buttonFactory("/members", "Members Dashboard")}
        {buttonFactory("/members/add", "Quick Action:\n Add a member")}
        {buttonFactory("/attendance", "Attendance Dashboard")}
      </Grid>
    </Container>
  )
}