import React from 'react'
import { IconButton, makeStyles } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  button: {
    position: 'fixed',
    top: 0,
    left: 0,
    margin: '10px'
  }
}))

export default function BackButton() {
  const classes = useStyles()

  let history = useHistory()

  const handleClick = () => {
    history.goBack()
  }

  return (
    <IconButton label={'Back'} onClick={() => handleClick()} className={classes.button}>
      <ArrowBackIcon />
    </IconButton>
  )
}