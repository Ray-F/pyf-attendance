import React from 'react'
import { Paper, makeStyles, Grid, Typography, Box, Button } from '@material-ui/core'


const useStyles =  makeStyles((theme) => ({
  container: {
    margin: "0 auto",
    width: 500,
    maxWidth: '100%',
    padding: 30,
    "& > *": {
      margin: "10px 0 0 0"
    }
  },

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
    <Paper className={`${classes.container} ${props.className}`}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h6'>{props.formTitle}</Typography>
          </Grid>
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
        </Grid>
      </Box>
    </Paper>
  )
}
