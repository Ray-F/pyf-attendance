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

export default function DashboardButton(props) {
  const classes = useStyles();
  const history = useHistory();

  const color = props.link ? 'primary' : 'secondary';

  const handleClick = () => {
    if (props.link) {
      history.push(props.link);
    } else if (props.action) {
      props.action();
    } else {
      throw new Error('You specified a link and an action, please remove one!');
    }
  };

  return (
    <Grid item xs={6} sm={4}>
      <Link onClick={() => handleClick()} className={classes.link}>
        <Button className={classes.actionButton} variant="outlined" color={color}>{props.text}</Button>
      </Link>
    </Grid>
  );
}
