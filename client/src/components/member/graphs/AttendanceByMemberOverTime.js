import React from 'react';
import { makeStyles } from '@material-ui/core';
import {
  ChartLabel, DiscreteColorLegend, FlexibleWidthXYPlot, LineSeries, XAxis, YAxis,
} from 'react-vis';
import PropTypes from 'prop-types';
import DisplayPaper from '../../wrappers/DisplayPaper';
import Plot from '../../wrappers/Plot';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  legend: {
    position: 'absolute',
    right: 40,
    top: 0,
  },
}));

const propTypes = {
  className: PropTypes.string,
  meetingData: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
};

function AttendanceByMemberOverTime({ meetingData, memberName, height }) {
  const classes = useStyles();

  meetingData = meetingData.sort((a, b) => (a.x < b.x ? 1 : -1));

  const yPercent = 70;
  const yPercentRed = 50;

  const line1 = [];
  const line2 = [];

  if (meetingData.length) {
    line1.push({ x: meetingData[0].x, y: yPercent });
    line1.push({ x: meetingData[meetingData.length - 1].x, y: yPercent });

    line2.push({ x: meetingData[0].x, y: yPercentRed })
    line2.push({ x: meetingData[meetingData.length - 1].x, y: yPercentRed })
  }

  return (
    <Plot height={height} plotTitle={`${memberName}'s attendance over time`}>

      <LineSeries data={meetingData} style={{ strokeWidth: 2 }} />
      <LineSeries data={line1} style={{ strokeWidth: 1, strokeDasharray: [2, 5], stroke: '#333' }} />
      <LineSeries data={line2} style={{ strokeWidth: 1, stroke: red[500] }} />


      <XAxis title="Time" position="middle" />
      <YAxis title="Attendance %" position="middle" />
    </Plot>
  );
}

AttendanceByMemberOverTime.propTypes = propTypes;

export default AttendanceByMemberOverTime;
