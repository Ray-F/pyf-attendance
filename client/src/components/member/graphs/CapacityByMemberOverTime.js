import React from 'react'
import { makeStyles } from "@material-ui/core";
import {
  ChartLabel,
  DiscreteColorLegend,
  FlexibleWidthXYPlot,
  LineSeries,
  RectSeries,
  VerticalRectSeries,
  XAxis,
  YAxis
} from "react-vis";
import DisplayPaper from "../../DisplayPaper";
import PropTypes from 'prop-types';
import Plot from "../../Plot";
import BarSeries from "react-vis/es/plot/series/bar-series";


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
  height: PropTypes.number.isRequired,
}

function CapacityByMemberOverTime(props) {
  const classes = useStyles()

  const meetingData = props.meetingData.sort((a, b) => (a.x < b.x ? 1 : -1))

  const yPercent = 30
  let line = []
  if (meetingData.length) {
    line.push({ x: meetingData[0].x, y: yPercent })
    line.push({ x: meetingData[meetingData.length - 1].x, y: yPercent })
  }

  return (
    <Plot height={props.height} plotTitle={`${props.memberName}'s capacity over time`} yDomain={[0, 100]}>
      <VerticalRectSeries data={meetingData} stroke={'white'} />

      <XAxis />
      <YAxis />


      <ChartLabel text={"Capacity %"} xPercent={-0.065} yPercent={1} includeMargin={false}
                  style={{ transform: 'rotate(-90)', textAnchor: 'middle', fontWeight: '700' }} />
      <ChartLabel text={"Time"} xPercent={1} yPercent={1.2} includeMargin={false} style={{fontWeight: '700'}} />
    </Plot>
  )
}

CapacityByMemberOverTime.propTypes = propTypes

export default CapacityByMemberOverTime