import React, { useEffect, useState } from 'react';
import {
  Box, Container, Divider, Grid, Hidden, IconButton, makeStyles, Tooltip,
} from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit'
import { Link } from 'react-router-dom'
import {
  getAttendanceColour,
  getCapacityColour,
} from '../../utils/CapacityUtils'
import AttendanceByMemberOverTime from './graphs/AttendanceByMemberOverTime'
import CapacityByMemberOverTime from './graphs/CapacityByMemberOverTime'
import DisplayPaper from '../wrappers/DisplayPaper'
import { red } from '@material-ui/core/colors'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px auto',
  },
  
  dataGridContainer: {
    height: 1000,
    width: '100%',
  },
  
  dataGrid: {
    minHeight: 850,
    margin: `${theme.spacing(2)}px 0`,
  },
  
  capacityIndicator: {
    width: 35,
    borderRadius: 100,
    height: 35,
    marginLeft: 15,
  },
  
  checkInIndicator: {
    fontStyle: 'italic',
    color: red[700],
    cursor: 'pointer',
  },
  
  optionIconContainer: {
    margin: '0 0 0 -5px',
    display: 'flex',
  },
  
  graph: {
    width: '100%',
  },
  
  absent: {
    color: 'red',
  },
  excused: {
    color: 'orange',
  },
  late: {
    color: 'purple',
  },
  present: {
    color: 'green',
  },
}))

/**
 * @param enableAttendance
 * @param enableCapacity
 * @param enableEditing
 * @param {CapacityView?} highlightCapacity
 */
export default function MemberList ({
  enableAttendance = true,
  enableCapacity = true,
  enableEditing = true,
  highlightCapacity = null,
}) {
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
        
        fetch('/api/events', { method: 'GET' }).then(async (promise) => {
          const events = await promise.json()
          
          const attendanceDataWithDate = attendanceData.map((attendance) => {
            const currentEvent = events.find(
              (event) => event._id === attendance.eventId)
            
            return {
              ...attendance,
              date: currentEvent.date,
              meetingName: currentEvent.title,
            }
          })
          
          setAttendance(attendanceDataWithDate)
          
          const membersWithAttendance = membersData.map((member) => {
            // Get all attendance records for the member
            /**
             * @type {Array}
             */
            const attendanceRecords = attendanceDataWithDate.filter(
              (attendance) => attendance.memberId === member._id &&
                attendance.eventType === 'Meeting').
            sort((a, b) => (a.date > b.date ? -1 : 1))
            
            const nShouldAttend = attendanceRecords.length
            
            if (nShouldAttend === 0) {
              member.meetingsAttended = 0
              member.capacityAvg = null
              member.attendanceAvg = null
              return member
            }
            
            member.nShouldAttend = nShouldAttend
            member.attendanceAvg = 0
            member.meetingsAttended = 0
            member.meetingsAbsent = 0
            member.meetingsExcused = 0
            member.highlightForCheckIn = false
            
            // If a highlightCapacity rules was passed, use this to determine which members to highlight
            if (highlightCapacity) {
              const capacities = {
                4: { count: 0, rule: highlightCapacity.numberReds },
                3: { count: 0, rule: highlightCapacity.numberOranges },
              }
              
              for (const key in capacities) {
                let current = 0, iterator = attendanceRecords.values()
                
                while (current < capacities[key].rule) {
                  let currentRecord = iterator.next().value
                  
                  if (!currentRecord.isAbsent) {
                    if (currentRecord.capacity >= key) capacities[key].count++
                    current++
                  }
                }
              }
              
              for (const key in capacities) {
                if (capacities[key].count >= capacities[key].rule) {
                  member.highlightForCheckIn = true
                }
              }
            }
            
            attendanceRecords.forEach((attendance) => {
              if (!attendance.isAbsent) {
                if (attendance.isShort) {
                  member.attendanceAvg += 0.8
                } else {
                  member.attendanceAvg += 1
                }
              } else {
                member.meetingsAbsent += 1
                if (attendance.isExcused) {
                  member.meetingsExcused += 1
                }
              }
              
              member.meetingsAttended += (attendance.isAbsent) ? 0 : 1
            })
            
            const lastAttendanceRecord = attendanceRecords[0]
            member.capacityAvg = lastAttendanceRecord.isAbsent
              ? 0
              : lastAttendanceRecord.capacity
            member.attendanceAvg = Math.round(
              member.attendanceAvg / nShouldAttend * 10 * 100) / 10
            
            return member
          })
          
          setMembers(membersWithAttendance)
        })
      })
    })
  }, [])
  
  let meetingAttendanceXY
  let meetingCapacityXY
  let memberAttendance
  
  if (!activeMember) {
    meetingCapacityXY = null
    meetingAttendanceXY = null
  } else {
    let currentAttended = 0
    let currentAttendanceAvg = 0
    
    meetingAttendanceXY = activeMemberAttendance.filter(
      (attendance) => attendance.eventType === 'Meeting').
    sort((a, b) => (a.date > b.date ? 1 : -1)).
    map((attendance) => {
      let plusage = 0
      if (!attendance.isAbsent) {
        if (attendance.isShort) {
          plusage = 0.8
        } else {
          plusage = 1
        }
      }
      currentAttendanceAvg = ((currentAttended * currentAttendanceAvg) +
        plusage) / (currentAttended + 1)
      currentAttended += 1
      
      return {
        x: new Date(attendance.date),
        y: currentAttendanceAvg * 100,
      }
    })
    
    meetingCapacityXY = activeMemberAttendance.filter(
      (attendance) => attendance.eventType === 'Meeting' &&
        !attendance.isAbsent).map((attendance) => ({
      x0: new Date(attendance.date),
      x: new Date(
        new Date(attendance.date).valueOf() + 1000 * 60 * 60 * 24 * 6),
      y: (5 - attendance.capacity) * 25,
      color: Math.round(attendance.capacity),
    }))
  }
  
  const capacityGraphDom = !meetingCapacityXY ? null : (
    <CapacityByMemberOverTime meetingData={meetingCapacityXY} height={250}
                              memberName={activeMember.fullName} />
  )
  
  const attendanceGraphDom = !meetingAttendanceXY ? null : (
    <AttendanceByMemberOverTime meetingData={meetingAttendanceXY} height={250}
                                memberName={activeMember.fullName} />
  )
  
  const attendanceAbsencesDom = !meetingAttendanceXY ? null : (
    <p>For {Math.round(
        activeMember.meetingsExcused / activeMember.meetingsAbsent * 100 *
        10) / 10}% of meetings they missed, they were excused. ({activeMember.meetingsExcused}/{activeMember.meetingsAbsent})</p>
  )
  
  const handleViewMember = (memberId) => {
    const active = members.find((member) => member._id === memberId)
    const activeAttendance = attendance.filter(
      (attendance) => attendance.memberId === memberId)
    setActiveMember(active)
    setActiveMemberAttendance(activeAttendance)
  }
  
  const columns = [
    {
      field: 'name',
      headerName: 'Member Name',
      description: 'Name of the member',
      sortable: true,
      disableColumnMenu: true,
      width: 160,
      renderCell: (params) => {
        if (params.row.highlightForCheckIn) {
          return (
            <Tooltip title={'Check in required'} placement={'left'} arrow>
              <span className={classes.checkInIndicator}>
                {params.row.name}
              </span>
            </Tooltip>)
        }
      },
    },
    enableAttendance ? {
      field: 'attendanceAvg',
      headerName: 'A %',
      description: 'Average attendance percentage',
      sortable: true,
      disableColumnMenu: true,
      width: 60,
      renderCell: (params) => {
        const colour = getAttendanceColour(params.row.attendanceAvg)
        
        if (params.row.attendanceAvg === null) {
          return (<span style={{ color: 'grey' }}>- %</span>)
        }
        
        return (
          <span style={{ color: colour }}>
            {params.row.attendanceAvg}
            %
          </span>
        )
      },
    } : {},
    enableCapacity ? {
      field: 'capacityAvg',
      headerName: 'Capacity',
      description: 'Capacity of member at last entry',
      sortable: true,
      disableColumnMenu: true,
      width: 100,
      headerAlign: 'center',
      renderCell: (params) => {
        const colour = getCapacityColour(params.row.capacityAvg)
        
        return (<Box style={{ backgroundColor: colour }}
                     className={classes.capacityIndicator} />)
      },
    } : {},
    enableAttendance ? {
      field: 'meetingsAttended',
      headerName: 'Meetings Attended',
      description: 'Meetings attended by member',
      sortable: false,
      disableColumnMenu: true,
      width: 80,
      renderCell: (params) => (
        <Box>
          {params.row.meetingsAttended}
          {' '}
          /
          {' '}
          {params.row.nShouldAttend}
        </Box>
      ),
    } : {},
    {
      field: 'options',
      headerName: 'Options',
      sortable: false,
      disableColumnMenu: true,
      width: enableEditing ? 120 : 100,
      headerAlign: 'center',
      renderCell: (params) => (
        <Box className={classes.optionIconContainer}>
          <IconButton onClick={() => handleViewMember(
            params.row.id)}><VisibilityIcon /></IconButton>
          {enableEditing ? <>
            <Divider orientation="vertical" flexItem />
            
            <Link to={`/members/add?memberId=${params.row.id}`}>
              <IconButton><EditIcon /></IconButton>
            </Link>
          </> : null}
        </Box>
      ),
    },
  ]
  
  const rows = members.filter(
    (member) => member.endDate === undefined || new Date(member.endDate) >
      new Date()).map((member) => ({
    id: member._id,
    name: member.fullName,
    attendanceAvg: member.attendanceAvg,
    capacityAvg: member.capacityAvg,
    meetingsAttended: member.meetingsAttended,
    nShouldAttend: member.nShouldAttend,
    highlightForCheckIn: member.highlightForCheckIn,
  })).sort((a, b) => a.name.localeCompare(b.name))
  
  const memberCols = [
    {
      field: 'name',
      headerName: 'Event Name',
      description: 'Name of the event',
      sortable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: (params) => {
        return (
          <span>{params.row.meetingName}</span>
        )
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      sortable: true,
      sortDirection: 'desc',
      disableColumnMenu: true,
      width: 100,
      renderCell: (params) => (
        new Date(params.row.date).toLocaleDateString('en-NZ').padStart(10, '0')
      ),
    },
    {
      field: 'attendance',
      headerName: 'Attendance',
      sortable: false,
      disableColumnMenu: true,
      width: 140,
      renderCell: (params) => {
        if (params.row.isAbsent) {
          if (params.row.isExcused) {
            return (
              <span className={classes.excused}>Excused</span>
            )
          }
          return (
            <span className={classes.absent}>Absent</span>
          )
        } else {
          if (params.row.isShort) {
            return (
              <span className={classes.late}>Late / Left Early</span>
            )
          }
          
          return (
            <span className={classes.present}>Present</span>
          )
        }
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params) => (
        <span>{params.row.excuseReason}</span>
      ),
    },
  ]
  
  const memberRows = activeMemberAttendance.filter(
    (attendance) => attendance.eventType === 'Meeting').map((attendance) => ({
    id: attendance.id,
    date: attendance.date,
    excuseReason: attendance.excuseReason,
    isAbsent: attendance.isAbsent,
    isExcused: attendance.isExcused,
    isShort: attendance.isShort,
    meetingName: attendance.meetingName,
  }))
  
  const attendanceList = !activeMember ? null : (
    <DisplayPaper
      formTitle={activeMember.fullName + '\'s meeting attendance'}
      className={classes.dataGridContainer}>
      {attendanceAbsencesDom}
      <DataGrid
        className={classes.dataGrid}
        columns={memberCols}
        rows={memberRows}
        rowHeight={40}
        headerHeight={50}
        pageSize={25}
      />
    </DisplayPaper>
  )
  
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={2}>
        <Hidden lgUp>
          <Grid item xs={1} />
        </Hidden>
        <Grid item xs={10} lg={6}>
          <DisplayPaper formTitle="List of members"
                        className={classes.dataGridContainer}>
            <DataGrid
              className={classes.dataGrid}
              columns={columns}
              rows={rows}
              rowHeight={40}
              headerHeight={50}
              pageSize={25}
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
            {enableAttendance ? <Grid item xs={12}>
              {attendanceGraphDom}
            </Grid> : null}
  
            {enableCapacity ? <Grid item xs={12}>
              {capacityGraphDom}
            </Grid> : null}
  
            {enableAttendance ? <Grid item xs={12}>
              {attendanceList}
            </Grid> : null}
            
            
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
