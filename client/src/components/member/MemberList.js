import React, { useEffect, useState } from 'react'
import DisplayPaper from "../DisplayPaper";
import { Box, Container, Divider, Grid, Hidden, IconButton, makeStyles } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import { getAttendanceColour, getCapacityColour } from "../../utils/CapacityUtils";
import AttendanceByMemberOverTime from "./graphs/AttendanceByMemberOverTime";
import CapacityByMemberOverTime from "./graphs/CapacityByMemberOverTime";


const useStyles = makeStyles((theme) => ({
  container: {
    margin: "50px auto"
  },

  dataGridContainer: {
    height: 650,
    width: '100%'
  },

  dataGrid: {
    minHeight: 520,
    margin: `${theme.spacing(2)}px 0`
  },

  capacityIndicator: {
    width: 35,
    borderRadius: 100,
    height: 35,
    marginLeft: 15
  },

  optionIconContainer: {
    margin: '0 0 0 -5px',
    display: 'flex'
  },

  graph: {
    width: '100%'
  }
}));

export default function MemberList(props) {
  const classes = useStyles()

  const [members, setMembers] = useState([])
  const [attendance, setAttendance] = useState([])

  const [activeMember, setActiveMember] = useState(null)
  const [activeMemberAttendance, setActiveMemberAttendance] = useState([])

  useEffect(() => {

    fetch('/api/members', { method: 'GET' }).then(async (promise) => {
      const membersData = await promise.json()

      fetch('/api/attendance/all', { method: 'GET' }).then(async (promise) => {
        const attendanceData = await promise.json()

        fetch ('/api/events', { method: 'GET' }).then(async (promise) => {
          const events = await promise.json()

          const attendanceDataWithDate = attendanceData.map(attendance => {
            const currentEvent = events.find(event => event._id === attendance.eventId)

            return {...attendance, date: currentEvent.date}
          })

          setAttendance(attendanceDataWithDate)

          const membersWithAttendance = membersData.map((member) => {

            // Get all attendance records for the member
            const attendanceRecords = attendanceDataWithDate.filter((attendance) => attendance.memberId === member._id && attendance.eventType === "Meeting")
              .sort((a, b) => a.date > b.date ? -1 : 1)

            const nShouldAttend = attendanceRecords.length

            if (nShouldAttend === 0) {
              member.meetingsAttended = 0
              member.capacityAvg = null
              member.attendanceAvg = null
              return member
            }

            member.capacityAvg = 0
            member.attendanceAvg = 0
            member.meetingsAttended = 0

            attendanceRecords.forEach(attendance => {
              member.attendanceAvg += (attendance.isAbsent) ? 0 : ((attendance.isShort) ? 0.8 : 1)
              member.meetingsAttended += (attendance.isAbsent) ? 0 : 1
            })

            for (let i = 0; i < attendanceRecords.length; i++) {
              if (!attendanceRecords[i].isAbsent) {
                member.capacityAvg = attendanceRecords[i].capacity
                break
              }
            }

            member.capacityAvg = Math.round(member.capacityAvg * 100) / 100
            member.attendanceAvg = Math.round(member.attendanceAvg / nShouldAttend * 10 * 100) / 10


            return member
          })

          setMembers(membersWithAttendance)
        })

      })
    })
  }, [])


  let meetingAttendanceXY
  let meetingCapacityXY

  if (!activeMember) {
    meetingCapacityXY = null
    meetingAttendanceXY = null
  } else {
    let currentAttended = 0
    let currentAttendanceAvg = 0

    meetingAttendanceXY = activeMemberAttendance.filter((attendance) => attendance.eventType === "Meeting").sort((a, b) => a.date > b.date ? 1 : -1)
      .map((attendance) => {
        let plusage = (attendance.isAbsent) ? 0 : ((attendance.isShort) ? 0.8 : 1)
        currentAttendanceAvg = ((currentAttended * currentAttendanceAvg) + plusage) / (currentAttended + 1)
        currentAttended += 1

        return {
          x: new Date(attendance.date),
          y: currentAttendanceAvg * 100
        }
      })

    meetingCapacityXY = activeMemberAttendance.filter((attendance) => attendance.eventType === "Meeting" && !attendance.isAbsent)
      .map((attendance) => {
        return {
          x0: new Date(attendance.date),
          x: new Date(new Date(attendance.date).valueOf() + 1000 * 60 * 60 * 24 * 6),
          y: (5 - attendance.capacity) * 25,
          color: Math.round(attendance.capacity)
        }
      })
  }

  let capacityGraphDom = !meetingCapacityXY ? null : (
    <CapacityByMemberOverTime meetingData={meetingCapacityXY} height={250} memberName={activeMember.fullName} />
  )

  let attendanceGraphDom = !meetingAttendanceXY ? null : (
    <AttendanceByMemberOverTime meetingData={meetingAttendanceXY} height={250} memberName={activeMember.fullName} />
  )

  const handleViewMember = (memberId) => {
    const active = members.find(member => member._id === memberId)
    const activeAttendance = attendance.filter((attendance) => attendance.memberId === memberId)

    setActiveMember(active)
    setActiveMemberAttendance(activeAttendance)
  }

  const columns = [
    {
      field: 'name', headerName: 'Member Name', description: 'Name of the member',
      sortable: true, sortDirection: 'asc', disableColumnMenu: true, width: 160
    },
    {
      field: 'attendanceAvg', headerName: 'A %', description: 'Average attendance percentage',
      sortable: true, disableColumnMenu: true, width: 60,
      renderCell: (params) => {

        let colour = getAttendanceColour(params.getValue('attendanceAvg'))

        if (params.getValue('attendanceAvg') === null) {
          return (<span style={{color: 'grey'}}>- %</span>)
        }

        return (<span style={{color: colour}}>{params.getValue('attendanceAvg')}%</span>)
      }
    },
    {
      field: 'capacityAvg', headerName: 'Capacity', description: 'Capacity of member at last entry',
      sortable: true, disableColumnMenu: true, width: 100, headerAlign: 'center',
      renderCell: (params) => {
        const colour = getCapacityColour(params.getValue('capacityAvg'))

        return (<Box style={{ backgroundColor: colour }} className={classes.capacityIndicator} />)
      }
    },
    {
      field: 'meetingsAttended', headerName: 'Meetings Attended', description: "Meetings attended by member",
      sortable: false, disableColumnMenu: true, width: 80
    },
    {
      field: 'options', headerName: 'Options', sortable: false,
      disableColumnMenu: true, width: 120, headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Box className={classes.optionIconContainer}>
            <IconButton onClick={() => handleViewMember(params.getValue("id"))}><VisibilityIcon /></IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton><EditIcon /></IconButton>
          </Box>
        )
      }
    }
  ]

  const rows = members.map((member, index) => {
    return {
      id: member._id,
      name: member.fullName,
      attendanceAvg: member.attendanceAvg,
      capacityAvg: member.capacityAvg,
      meetingsAttended: member.meetingsAttended
    }
  })

  return (
    <Container maxWidth={'lg'} className={classes.container}>
      <Grid container spacing={2}>
        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>
        <Grid item xs={10} lg={6}>
          <DisplayPaper formTitle={"List of members"} className={classes.dataGridContainer}>
            <DataGrid className={classes.dataGrid}
                      columns={columns} rows={rows}
                      rowHeight={40} headerHeight={50}
                      pageSize={10}
            />
          </DisplayPaper>
        </Grid>

        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>

        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>

        <Grid item xs={10} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {attendanceGraphDom}
            </Grid>
            <Grid item xs={12}>
              {capacityGraphDom}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}