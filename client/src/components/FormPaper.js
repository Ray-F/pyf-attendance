import React from 'react'
import { Paper, makeStyles, Grid, Typography, Box, Button } from '@material-ui/core'
import DisplayPaper from "./DisplayPaper";


const useStyles =  makeStyles((theme) => ({
  successCaption: {
    marginTop: 10,
    display: 'block',
    color: '#32612D'
  },

  errorCaption: {
    marginTop: 10,
    display: 'block',
    color: '#992222'
  },

  requiredFields: {
    float: 'right',
    fontSize: '0.9em',
    color: 'grey'
  }
}))


export default function FormPaper(props) {
  const classes = useStyles()

  return (
    <DisplayPaper className={props.className} formTitle={props.formTitle}>

      {props.children}

      <Grid item xs={12}>
        <Typography variant="body2" className={classes.requiredFields}>
          * required fields
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={props.handleSubmit}>
          Submit
        </Button>

        <Typography variant="body2" className={(props.submitSuccess) ? classes.successCaption : classes.errorCaption}>
          {props.promptMessage}
        </Typography>
      </Grid>
    </DisplayPaper>
  )
}
