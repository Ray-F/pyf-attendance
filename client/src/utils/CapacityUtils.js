import {
  amber, green, grey, orange, red,
} from '@material-ui/core/colors';

const colourRed = red[500];
const colourOrange = orange[500];
const colourYellow = amber[500];
const colourGreen = green[500];
const colourGrey = grey[300];

export function getCapacityColour(capacityLevel) {
  let colour;

  switch (Math.round(capacityLevel)) {
    case 1: colour = colourGreen; break;
    case 2: colour = colourYellow; break;
    case 3: colour = colourOrange; break;
    case 4: colour = colourRed; break;
    case undefined:
    case null:
    case 0:
    default: colour = colourGrey; break;
  }

  return colour;
}

export function getAttendanceColour(attendancePct) {
  if (attendancePct === null || attendancePct === undefined) {
    return colourGrey;
  } if (attendancePct > 80) {
    return colourGreen;
  } if (attendancePct > 60) {
    return colourOrange;
  }
  return colourRed;
}
