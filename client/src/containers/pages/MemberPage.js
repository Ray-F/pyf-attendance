import React from 'react';
import { makeStyles } from '@material-ui/core';
import MemberForm from '../../components/member/MemberForm';
import DisplayPaper from "../../components/DisplayPaper";
import MemberList from "../../components/member/MemberList";
import { useLocation } from "react-router";


const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto'
  }
}));

export default function MemberPage(props) {
  const classes = useStyles();

  const query = new URLSearchParams(useLocation().search)

  const operation = props.match.params.operation

  switch (operation) {
    case 'add': return <MemberForm className={classes.form} memberId={query.get('memberId')} />
    case 'delete':return <DisplayPaper formTitle={"Delete member"} />
    case 'list':
    default:
      return <MemberList />
  }

}