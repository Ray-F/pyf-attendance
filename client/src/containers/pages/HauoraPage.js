import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router';
import MemberForm from '../../components/member/MemberForm';
import DisplayPaper from '../../components/wrappers/DisplayPaper';
import MemberList from '../../components/member/MemberList';
import { CapacityView } from '../../utils/CapacityUtils';

const useStyles = makeStyles((theme) => ({
  form: {
    margin: '50px auto',
  },
}));

export default function HauoraPage(props) {
  const classes = useStyles();

  const query = new URLSearchParams(useLocation().search);

  const { operation } = props.match.params;

  switch (operation) {
    case 'add': return <MemberForm className={classes.form} memberId={query.get('memberId')} />;
    case 'delete': return <DisplayPaper formTitle="Delete member" />;
    case 'list':
    default:
      return (
        <MemberList
          enableAttendance={false}
          enableCapacity={true}
          enableEditing={false}
          highlightCapacity={new CapacityView(1, 2)}
        />);
  }
}
