const { saveAttendanceToDb } = require("../models/mongodb/MongoRepository");
const {
  deleteAttendanceFromDb, setEventRecorded, deleteAllAttendanceFromDb, getEventFromDb,
  getMembersFromDb, getAttendanceFromDb
} = require('../models/mongodb/MongoRepository')

const { Attendance } = require('../models/Attendance')

/**
 * Gets all attendance records associated with `req.query.eventId` or `req.query.memberId`
 */
const getAttendance = async (req, res, next) => {
  const eventId = req.query.eventId
  const memberId = req.query.memberId

  let records

  if (eventId) {
    // The event we are getting attendance records for
    const event = await getEventFromDb(eventId)
    if (event.hasAttendanceRecords) {
      records = (await getAttendanceFromDb(eventId)).map((attendance) => attendance.toDto())
    } else {
      records = await generateNewAttendanceRecords(event)
    }
  } else if (memberId) {
    records = (await getAttendanceFromDb(null, memberId)).map((attendance) => attendance.toDto())
  } else {
    records = (await getAttendanceFromDb()).map((attendance) => attendance.toDto())
  }

  res.json(records)
}

/**
 * Only call this function if an event has not been submitted against before.
 */
const generateNewAttendanceRecords = async (eventObject) => {
  const members = await getMembersFromDb()

  return members.filter(member => {
    const eventDate = new Date(eventObject.date)

    if (member.endDate) {
      return (eventDate >= member.startDate && eventDate <= member.endDate)
    } else {
      return (eventDate >= member.startDate)
    }
  }).map((member) => {
    const attendance = Attendance.fromDto(
      {
        _id: undefined,
        memberId: member.id,
        fullName: member.fullName,
        eventId: eventObject._id,
        eventType: eventObject.type,
        isShort: false,
        isAbsent: false,
        isExcused: false,
        excuseReason: '',
        capacity: 1
      }
    )

    return attendance.toDto()
  })
}

const resetAttendance = async (req, res, next) => {
  const deleteAttendanceResult = await deleteAllAttendanceFromDb()
  await setEventRecorded(null, false)

  res.send(`Delete successful: ${deleteAttendanceResult.result.n} attendance records deleted`)
}

/**
 * Called when user submits an attendance sheet.
 */
const saveAttendance = async (req, res, next) => {
  const records = req.body.map(record => Attendance.fromDto(record))
  const eventId = req.body[0].eventId
  const eventObject = await getEventFromDb(eventId)

  if (eventObject) {
    if (eventObject.hasAttendanceRecords) {
      await deleteAttendanceFromDb(eventId)
    }

    await setEventRecorded(eventId, true)
    await saveAttendanceToDb(records)
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
}

const deleteAttendance = async (req, res, next) => {
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


module.exports = {
  getAttendance,
  saveAttendance,
  resetAttendance,
  deleteAttendance
}