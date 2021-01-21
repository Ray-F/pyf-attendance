import React, {Component} from 'react';

import {BrowserRouter, Switch, Route} from 'react-router-dom';

import AttendancePage from './pages/AttendancePage';
import MemberPage from "./pages/MemberPage";
import EventPage from "./pages/EventPage";


class MainRouter extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={"/event"} component={EventPage} />
          <Route path={"/member"} component={MemberPage} />
          <Route path={"/attendance"} component={AttendancePage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default MainRouter;
