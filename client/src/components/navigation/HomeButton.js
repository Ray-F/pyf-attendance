import React from 'react'
import { IconButton, makeStyles } from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  button: {
    position: 'fixed',
    top: 0,
    left: 50,
    margin: '10px'
  }
}))

export default function HomeButton() {
  const classes = useStyles()

  let history = useHistory()

  const handleClick = () => {
    history.push("/")
  }

  return (
    <IconButton label={'Home'} onClick={() => handleClick()} className={classes.button}>
      <HomeIcon />
    </IconButton>
  )
}