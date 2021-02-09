import React from 'react'
import { IconButton, makeStyles } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  backButton: {
    position: 'fixed',
    top: 0,
    left: 0,
    margin: '10px'
  },

  homeButton: {
    position: 'fixed',
    top: 0,
    left: 50,
    margin: '10px'
  }
}))


export default function NavButton(props) {
  const classes = useStyles()
  let history = useHistory()

  const handleClick = () => {
    if(props.navType === "backButton") {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  if(props.navType === "backButton") {
    return (
        <IconButton label={'Back'} onClick={() => handleClick()} className={classes.backButton}>
          <ArrowBackIcon />
        </IconButton>
    )
  } else {
    return (
        <IconButton label={'Home'} onClick={() => handleClick()} className={classes.homeButton}>
          <HomeIcon />
        </IconButton>
    )
  }
}