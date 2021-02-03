const { Router } = require('express');

const { saveEvent, getEvents, getRecentEvents, deleteEvent, resetEvents } = require('../controllers/EventController')
const { getMembers, saveMember, deleteMember, resetMembers } = require('../controllers/MemberController')
const {
  resetAttendance, getAllAttendanceRecords, saveAttendanceSheet, getAttendanceSheet, deleteAttendanceRecords
} = require('../controllers/AttendanceController')

const router = Router();

router.get('/members', getMembers)
router.post('/members/add', saveMember)
router.get('/members/delete', deleteMember)
router.get('/members/reset', resetMembers)

router.get('/events', getEvents)
router.get('/events/recent', getRecentEvents)
router.post('/events/add', saveEvent)
router.get('/events/reset', resetEvents)
router.get('/events/delete', deleteEvent)

router.get('/attendance', getAttendanceSheet)
router.get('/attendance/all', getAllAttendanceRecords)
router.post('/attendance', saveAttendanceSheet)
router.get('/attendance/reset', resetAttendance)
router.get('/attendance/delete', deleteAttendanceRecords)

router.get('*', (req, res) => {
  res.status(200).send(
    `
    <h2>PYF Attendance API</h2>
    <p>
      You have reached the express API for PYF attendance. Ensure you have the correct permissions before attempting to use the API.
      Email rf.raymondfeng@gmail.com for any questions on usage.
    </p>
  `
  )
})


module.exports = router;
