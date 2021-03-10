import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Box, makeStyles } from '@material-ui/core';

import EventPage from './pages/EventPage';
import MemberPage from './pages/MemberPage';
import AttendancePage from './pages/AttendancePage';
import HomePage from './pages/HomePage';
import NavButton from '../components/navigation/NavButton';
import DevelopmentDashboardPage from './pages/DevelopmentDashboardPage';
import RestrictedPage from './pages/RestrictedPage';

const useStyles = makeStyles((theme) => ({
  navContainer: {
    left: theme.spacing(2),
    top: theme.spacing(5),
    position: 'fixed',
  },
}));

export default function MainRouter() {
  const classes = useStyles();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');

  const homePage = (props) => (
    <HomePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser} {...props} />
  );

  return (
    <BrowserRouter>
      <Box className={classes.navContainer}>
        <NavButton navType="back" />
        <NavButton navType="home" />
      </Box>
      <Switch>
        <Route exact path="/" render={(props) => homePage(props)} />
        <Route path="/403" render={() => <RestrictedPage loggedIn={false}
                                                         message="You do not have permission to use this application" />} />

        {/* Restricted pages below here */}
        <RestrictedPage loggedIn={loggedIn}>
          <Route exact path="/events/:operation?" component={EventPage} />
          <Route path="/members/:operation?" component={MemberPage} />
          <Route path="/attendance" component={AttendancePage} />
          <Route path="/dev-dashboard" component={DevelopmentDashboardPage} />
        </RestrictedPage>

        {/* Default fallback route when user is logged in. If user is not logged in, fallback to RestrictedPage */}
        <Route path="" render={(props) => homePage(props)} />
      </Switch>
    </BrowserRouter>
  );
}
