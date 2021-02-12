import React from 'react';
import { CssBaseline } from '@material-ui/core';
import '../styling/style.scss';
import 'react-vis/dist/style.css';

import MainRouter from './MainRouter';

export default function App() {
  return (
    <>
      <CssBaseline />
      <MainRouter />
    </>
  );
}
