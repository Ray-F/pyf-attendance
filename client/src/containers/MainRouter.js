import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import EventPage from "./pages/EventPage";
import MemberPage from "./pages/MemberPage";
import AttendancePage from "./pages/AttendancePage";
import HomePage from "./pages/HomePage";
import BackButton from "../components/navigation/BackButton";


export default function MainRouter() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <BackButton />
        <Switch>
          <Route exact path={"/events/:operation?"} component={EventPage} />
          <Route path={"/members/:operation?"} component={MemberPage} />
          <Route path={"/attendance"} component={AttendancePage} />
          <Route path={""} component={HomePage} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  )
}