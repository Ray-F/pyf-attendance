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

export default function buttonFactory(link, text, action) {
  const classes = useStyles();
  const history = useHistory();

  const color = link ? 'primary' : 'secondary';

  const handleClick = (link) => {
    if (link) {
      history.push(link);
    } else if (action) {
      action();
    }
  };

  return (
    <Grid item xs={6} sm={4}>
      <Link onClick={() => handleClick(link)} className={classes.link}>
        <Button className={classes.actionButton} variant="outlined" color={color}>{text}</Button>
      </Link>
    </Grid>
  );
}
