import { Button, Grid, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
  },

  actionButton: {
    width: '200px',
    height: '100px',
    maxWidth: '100%',
  },

}));

export default function DashboardButton({ action, link, text, visible }) {
  const classes = useStyles();

  const color = link ? 'primary' : 'secondary';

  if (!visible) {
    return null;
  }

  if (link) {
    return (
      <Grid item xs={6} sm={4}>
        <Link to={link} className={classes.link}>
          <Button className={classes.actionButton} variant="outlined" color={color}>{text}</Button>
        </Link>
      </Grid>
    );
  } if (action) {
    return (
      <Grid item xs={6} sm={4}>
        <Button className={classes.actionButton} onClick={() => action()} variant="outlined" color={color}>{text}</Button>
      </Grid>
    );
  }
  throw new Error('You specified a link and an action, please remove one!');
}
