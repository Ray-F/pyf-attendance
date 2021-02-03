const { deleteAttendanceFromDb } = require("../models/mongodb/MongoRepository");
const { deleteEventFromDb } = require("../models/mongodb/MongoRepository");
const {
  deleteAllEventsFromDb, saveEventToDb, getEventsFromDb,
  deleteAllAttendanceFromDb
} = require("../models/mongodb/MongoRepository");


const getEvents = async (req, res, next) => {
  let events
  if (req.query.eventId) {
    events = await getEventsFromDb(req.query.eventId)
  } else {
    events = await getEventsFromDb()
  }

  return res.json(events)
}

const getRecentEvents = async (req, res, next) => {
  let events = await getEventsFromDb()
  let numberToSplice = (req.query.number) ? (req.query.number) : 5

  let sortedEvents = events.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return (dateA > dateB) ? -1 : 1
  })

  if (sortedEvents.length > numberToSplice) {
    sortedEvents = sortedEvents.slice(0, numberToSplice)
  }

  res.json(sortedEvents)
}

const saveEvent = async (req, res, next) => {
  let eventObject = req.body
  eventObject.date = new Date(eventObject.date)

  await saveEventToDb(eventObject)
  res.sendStatus(200)
}

const deleteEvent = async (req, res, next) => {
  let eventId = req.query.eventId

  if (eventId === undefined) {
    res.status(404).send("No event Id specified! No records deleted")
  } else {
    const deleteResult = await deleteEventFromDb(eventId)
    const deleteAttendanceResult = await deleteAttendanceFromDb(eventId)

    res.status(200).send(`Delete successful: ${deleteResult.result.n} event(s) and ${deleteAttendanceResult.result.n} attendance record(s) were wiped.`)
  }
}

const resetEvents = async (req, res, next) => {
  const deleteResult = await deleteAllEventsFromDb()
  const deleteAttendanceResult = await deleteAllAttendanceFromDb()

  res.status(200).send(`Delete successful: ${deleteResult.result.n} events and ${deleteAttendanceResult.result.n} attendance records were wiped.`)
}


module.exports = {
  getEvents, getRecentEvents, saveEvent, deleteEvent, resetEvents
}