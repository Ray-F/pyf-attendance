import React from 'react';
import { makeStyles } from '@material-ui/core';
import MemberForm from '../../components/member/MemberForm';
import DisplayPaper from "../../components/DisplayPaper";
import MemberList from "../../components/member/MemberList";


const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto'
  }
}));

export default function MemberPage(props) {
  const classes = useStyles();

  const operation = props.match.params.operation

  switch (operation) {
    case 'add': return <MemberForm className={classes.form} />
    case 'delete':return <DisplayPaper className={classes.paper} formTitle={"Delete member"} />
    case 'list':
    default:
      return <MemberList className={classes.paper} />
  }

}