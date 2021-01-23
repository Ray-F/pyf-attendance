import React, { Component } from 'react';
import {CssBaseline} from '@material-ui/core';
import MainRouter from './MainRouter';

import '../styling/style.scss';
import "react-vis/dist/style.css"

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <MainRouter />
      </React.Fragment>
    );
  }

}

export default App;
