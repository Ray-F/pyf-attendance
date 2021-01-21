const { saveAttendanceToDb } = require("../models/mongodb/MongoRepository");
const { getMembersFromDb, getEventsFromDb, getAttendanceFromDb } = require('../models/mongodb/MongoRepository')
const ObjectId = require('mongodb').ObjectId

const getAttendanceSheet = async (req, res, next) => {
  if (req.query.eventId) {
    try {
      // The event we are getting attendance records for
      const event = await getEventsFromDb(req.query.eventId)

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

  const newRecords = attendanceData.map((record, index) => {
    return {
      id: index + 1,
      fullName: record.member.fullName,
      isShort: record.isLate,
      isAbsent: record.isAbsent,
      isExcused: record.isExcused,
      excuseReason: record.excuseReason,
      capacity: record.capacity
    }
  })

  res.json(newRecords)
}

const saveAttendanceSheet = async (req, res, next) => {
  const parsedRecords = req.body.map((record, index) => {
    return {
      event: {
        eventId: ObjectId(record.eventId),
        type: record.eventType
      },
      member: {
        memberId: ObjectId(record.memberId),
        fullName: record.fullName
      },
      isLate: record.isShort,
      isAbsent: record.isAbsent,
      isExcused: record.isExcused,
      excuseReason: record.excuseReason,
      capacity: record.capacity
    }
  })

  saveAttendanceToDb(parsedRecords)

  res.sendStatus(200)
}


/**
 * Call this for an event where we already have records (i.e event.hasAttendanceRecords = `true`).
 */
const getAttendanceRecords = async (eventObject) => {
  const attendanceData = await getAttendanceFromDb(eventObject._id)

  return attendanceData.map((record, index) => {
    return {
      objectId: record._id,
      memberId: record.member.memberId,
      fullName: record.member.fullName,
      eventId: record.event.eventId,
      eventType: record.event.type,
      id: index + 1,
      isShort: record.isLate,
      isAbsent: record.isAbsent,
      isExcused: record.isExcused,
      excuseReason: record.excuseReason,
      capacity: record.capacity
    }
  })
}

/**
 * Only call this function if an event has not been submitted against before.
 */
const generateNewAttendanceRecords = async (eventObject) => {
  const members = await getMembersFromDb()

  return members.filter((member, index) => {
    return (new Date(member.startDate) < new Date(eventObject.date))
  }).map((member, index) => {
    return {
      memberId: member.memberId,
      fullName: member.fullName,
      eventId: eventObject._id,
      eventType: eventObject.type,
      id: index + 1,
      isShort: false,
      isAbsent: false,
      isExcused: false,
      excuseReason: '',
      capacity: 1
    }
  })
}


module.exports = {
  getAttendanceSheet, saveAttendanceSheet, getAllAttendanceRecords
}