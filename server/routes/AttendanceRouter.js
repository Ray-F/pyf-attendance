const { Router } = require('express');

const { saveEvent, getEvents, getRecentEvents } = require('../controllers/EventController')
const { getMembers } = require('../controllers/MemberController')
const { getAllAttendanceRecords, saveAttendanceSheet, getAttendanceSheet } = require('../controllers/AttendanceController')

const router = Router();

router.get('/members', getMembers)

router.get('/events', getEvents)
router.post('/events/add', saveEvent)
router.get('/events/recent', getRecentEvents)


router.get('/attendance', getAttendanceSheet)
router.get('/attendance-list', getAllAttendanceRecords)
router.post('/attendance', saveAttendanceSheet)

module.exports = router;
