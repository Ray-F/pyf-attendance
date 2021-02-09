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
/*
* Returns an array of JSON objects of a given length (10 if undefined), filled firs by all events that still need submitting, with the rest
* of the array being filled with the most recent events ordered by date.
* */
const getEventDashboardList = async (req, res, next) => {
  // Check if an array length number has been defined and store that value, otherwise default the value to 10
  let listLength = req.query.listLength ? req.query.listLength : 10

  // Find and store all events from the collection
  let allEvents = await getEventsFromDb()

  // Find and store all events where attendance records still need to be submitted and sort these by date
  // We sort these by date is so that when taking the first 10 events, these are the most recent events
  let noRecordEvents = allEvents
    .filter(event => !event.hasAttendanceRecords)
    .sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1)

  // Find and store all events that have attendance records and sort these by date
  let recordEvents = allEvents
    .filter(event => event.hasAttendanceRecords)
    .sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1)

  let combinedEvents = [...noRecordEvents, ...recordEvents].slice(0, listLength)

  if (req.query.eventId) {
    // Check if the requested eventId exists inside the current list of events, and if not, add the event
    const doesExist = combinedEvents.some(event => event._id.toString() === req.query.eventId)
    if (!doesExist) {
      let currentEvent = allEvents.find(event => event._id.toString() === req.query.eventId)
      if (currentEvent) {
        combinedEvents.push(currentEvent)
      }
    }
  }

  const sortedEvents = combinedEvents.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1)
  res.json(sortedEvents)
}

const getRecentEvents = async (req, res, next) => {
  let events = await getEventsFromDb()
  let numberToSplice = (req.query.number) ? (req.query.number) : 5

  let sortedEvents = events.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return (dateA > dateB) ? -1 : 1
  })

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
  getEvents, getRecentEvents, saveEvent, deleteEvent, resetEvents, getEventDashboardList
}