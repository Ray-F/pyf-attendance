import React from 'react'
import { IconButton, makeStyles } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";


const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block'
  }
}))


const propTypes = {
  navType: PropTypes.string,
  label: PropTypes.string,
  relativePath: PropTypes.string,
  iconType: PropTypes.any
}

function NavButton(props) {
  const classes = useStyles()
  const history = useHistory()

  switch (props.navType) {
    case "back":
      return (
        <IconButton label={'Back'} onClick={() => history.goBack()} className={classes.backButton}>
          <ArrowBackIcon />
        </IconButton>
      )
    case "home":
      return (
        <IconButton label={'Home'} onClick={() => history.push('/')} className={classes.button}>
          <HomeIcon />
        </IconButton>
      )
    default:
      return (
        <IconButton label={props.label} onClick={() => history.push(props.relativePath)} className={classes.button}>
          {props.iconType}
        </IconButton>
      )
  }
}

NavButton.propTypes = propTypes

export default NavButton