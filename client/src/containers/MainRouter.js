import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Box, makeStyles } from '@material-ui/core';

import EventPage from './pages/EventPage';
import MemberPage from './pages/MemberPage';
import AttendancePage from './pages/AttendancePage';
import HomePage from './pages/HomePage';
import NavButton from '../components/navigation/NavButton';
import DevelopmentDashboardPage from './pages/DevelopmentDashboardPage';

const useStyles = makeStyles((theme) => ({
  navContainer: {
    left: theme.spacing(2),
    top: theme.spacing(5),
    position: 'fixed',
  },
}));

export default function MainRouter() {
  const classes = useStyles();

  return (
    <>
      <BrowserRouter>
        <Box className={classes.navContainer}>
          <NavButton navType="back" />
          <NavButton navType="home" />
        </Box>
        <Switch>
          <Route exact path="/events/:operation?" component={EventPage} />
          <Route path="/members/:operation?" component={MemberPage} />
          <Route path="/attendance" component={AttendancePage} />
          <Route path="/dev-dashboard" component={DevelopmentDashboardPage} />
          <Route path="" component={HomePage} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
