import React, {Component} from 'react';

import {BrowserRouter, Switch, Route} from 'react-router-dom';

import AttendancePage from './pages/AttendancePage';
import MemberPage from "./pages/MemberPage";
import EventPage from "./pages/EventPage";
import HomePage from "./pages/HomePage";
import BackButton from "../components/navigation/BackButton";


class MainRouter extends Component {

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <BackButton />
          <Switch>
            <Route exact path={"/events/:operation?"} component={EventPage} />
            <Route path={"/members/add"} component={MemberPage} />
            <Route path={"/attendance"} component={AttendancePage} />
            <Route path={""} component={HomePage} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default MainRouter;
