const { saveAttendanceToDb } = require("../models/mongodb/MongoRepository");
const {
  deleteAttendanceFromDb, setEventRecorded, deleteAllAttendanceFromDb,
  getMembersFromDb, getEventsFromDb, getAttendanceFromDb
} = require('../models/mongodb/MongoRepository')

const { Attendance } = require('../models/Attendance')

const getAttendanceSheet = async (req, res, next) => {
  const eventId = req.query.eventId
  if (eventId) {
    try {
      // The event we are getting attendance records for
      const event = await getEventsFromDb(eventId)

      if (event.hasAttendanceRecords) {
        const records = await getAttendanceRecords(event)
        res.json(records)
      } else {
        const newRecords = await generateNewAttendanceRecords(event)
        res.json(newRecords)
      }
    } catch (e) {
      console.log(e)
      res.status(500).send("Error 500: Internal Server Error. Error when getting attendance data, was the ID correct?")
    }
  } else {
    res.json([])
  }
}

const getAllAttendanceRecords = async (req, res, next) => {
  const attendanceData = await getAttendanceFromDb()

  const records = attendanceData.map(record => {
    return new Attendance(null, record).toDto()
  })

  res.json(records)
}

const resetAttendance = async (req, res, next) => {
  const deleteAttendanceResult = await deleteAllAttendanceFromDb()
  await setEventRecorded(null, false)

  res.send(`Delete successful: ${deleteAttendanceResult.result.n} attendance records deleted`)
}

/**
 * Called when user submits an attendance sheet.
 */
const saveAttendanceSheet = async (req, res, next) => {
  const records = req.body.map(record => new Attendance(record, null).toDbo())
  const eventId = req.body[0].eventId
  const eventObject = await getEventsFromDb(eventId)

  if (eventObject === null) {
    res.sendStatus(500)
  } else {
    if (eventObject.hasAttendanceRecords) {
      await deleteAttendanceFromDb(eventId)
    }

    await setEventRecorded(eventId, true)
    await saveAttendanceToDb(records)
    res.sendStatus(200)
  }
}

const deleteAttendanceRecords = async (req, res, next) => {
  if (req.query.eventId) {
    const deleteAttendanceResult = await deleteAttendanceFromDb(req.query.eventId)
    await setEventRecorded(req.query.eventId, false)

    res.send(`Delete successful: ${deleteAttendanceResult.result.n} attendance records deleted for event ${req.query.eventId}`)
  } else if (req.query.memberId) {
    const deleteAttendanceResult = await deleteAttendanceFromDb(null, req.query.memberId)

    res.send(`Delete successful: ${deleteAttendanceResult.result.n} attendance records deleted for member ${req.query.memberId}`)
  } else {
    res.status(404).send("No event/member Id specified! No records deleted")
  }
}

/**
 * Call this for an event where we already have records (i.e event.hasAttendanceRecords = `true`).
 */
const getAttendanceRecords = async (eventObject) => {
  const attendanceData = await getAttendanceFromDb(eventObject._id)

  return attendanceData.map(record => {
    return new Attendance(null, record).toDto()
  })
}

/**
 * Only call this function if an event has not been submitted against before.
 */
const generateNewAttendanceRecords = async (eventObject) => {
  const members = await getMembersFromDb()

  return members.filter(member => {
    return (new Date(member.startDate) < new Date(eventObject.date))
  }).map((member, index) => {
    const attendancePojo = {
      memberId: member._id,
      fullName: member.fullName,
      eventId: eventObject._id,
      eventType: eventObject.type,
      isShort: false,
      isAbsent: false,
      isExcused: false,
      excuseReason: '',
      capacity: 1
    }

    return new Attendance(attendancePojo).toDto()
  })
}


module.exports = {
  getAttendanceSheet, saveAttendanceSheet, getAllAttendanceRecords, resetAttendance, deleteAttendanceRecords
}