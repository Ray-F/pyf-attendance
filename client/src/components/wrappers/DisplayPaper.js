import React from 'react';
import {
  Paper, makeStyles, Grid, Typography, Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    width: 500,
    maxWidth: '100%',
    boxSizing: 'border-box',
    padding: 30,
    '& > *': {
      margin: '10px 0 0 0',
    },
  },
}));

const propTypes = {
  className: PropTypes.string,
  formTitle: PropTypes.string.isRequired,
};

function DisplayPaper(props) {
  const classes = useStyles();

  return (
    <Paper className={`${props.className} ${classes.container}`}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">{props.formTitle}</Typography>
          </Grid>

          <Grid item xs={12}>
            {props.children}
          </Grid>

        </Grid>
      </Box>
    </Paper>
  );
}

DisplayPaper.propTypes = propTypes;

export default DisplayPaper;
