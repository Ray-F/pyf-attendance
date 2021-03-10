import React from 'react';
import { FlexibleWidthXYPlot } from 'react-vis';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import {
  amber, green, orange, red,
} from '@material-ui/core/colors';
import DisplayPaper from './DisplayPaper';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
}));

const propTypes = {
  className: PropTypes.object,
  height: PropTypes.number.isRequired,
  plotTitle: PropTypes.string.isRequired,
  yDomain: PropTypes.array,
};

function Plot(props) {
  const classes = useStyles();

  return (
    <DisplayPaper className={classes.container} formTitle={props.plotTitle}>
      <FlexibleWidthXYPlot
        margin={{
          left: 40, right: 40, top: 20, bottom: 40,
        }}
        height={props.height}
        xType="time"
        yDomain={props.yDomain ? props.yDomain : [0, 100]}
        colorType="category"
        colorDomain={[1, 2, 3, 4]}
        colorRange={[green[500], amber[500], orange[500], red[500]]}
      >
        {props.children}
      </FlexibleWidthXYPlot>
    </DisplayPaper>
  );
}

Plot.propTypes = propTypes;

export default Plot;
