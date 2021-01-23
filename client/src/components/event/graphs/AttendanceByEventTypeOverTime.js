import React from 'react'
import { makeStyles } from "@material-ui/core";
import { DiscreteColorLegend, FlexibleWidthXYPlot, LineSeries, XAxis, YAxis } from "react-vis";
import DisplayPaper from "../../DisplayPaper";
import PropTypes from 'prop-types';
import Plot from "../../Plot";


const useStyles = makeStyles((theme) => ({
  legend: {
    position: 'absolute',
    right: 40,
    top: 0
  }
}));

const propTypes = {
  className: PropTypes.object,
  meetingData: PropTypes.array.isRequired,
  eventData: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
}

function AttendanceByEventTypeOverTime(props) {
  const classes = useStyles()

  const meetingData = props.meetingData.sort((a, b) => (a.x < b.x ? 1 : -1))
  const eventData = props.eventData.sort((a, b) => (a.x < b.x ? 1 : -1))

  const yPercent = 70
  let line = []
  if (meetingData.length) {
    line.push({ x: meetingData[0].x, y: yPercent })
    line.push({ x: meetingData[meetingData.length - 1].x, y: yPercent })
  }

  return (
    <Plot height={props.height} plotTitle={"Event attendance over time"}>
      <XAxis title={"Time"} position={"middle"} />
      <YAxis title="Attendance %"  position={"middle"} />

      <LineSeries data={meetingData} style={{ strokeWidth: 2 }} />
      <LineSeries data={eventData} style={{ strokeWidth: 2 }} />
      <LineSeries data={line} style={{ strokeWidth: 1 }} strokeStyle={'dashed'} />

      <DiscreteColorLegend className={classes.legend} items={[{title: "Meeting"}, {title: "Project"}]} orientation={'vertical'} />
    </Plot>
  )
}

AttendanceByEventTypeOverTime.propTypes = propTypes

export default AttendanceByEventTypeOverTime