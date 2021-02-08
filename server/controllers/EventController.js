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
  let listLength = (req.query.listLength !== undefined) ? req.query.listLength : 10

  // Find & store all events from the collection
  let allEvents = await getEventsFromDb()

  // Find & store all events that still need submitting
  let noRecordEvents = allEvents.filter((event) => {
    return !event.hasAttendanceRecords
  })

  // Find & store all events that have allready been submitted
  let recordEvents = allEvents.filter((event) => {
    return event.hasAttendanceRecords
  })

  let sortedRecordEvents = recordEvents.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return (dateA > dateB) ? -1 : 1
  })

  // Find how many recent events will fit into the final array, and reduce the array to only contain those objects
  if (noRecordEvents.length >= listLength) {
    recordEvents = []
  } else if (recordEvents.length > listLength - noRecordEvents.length) {
    recordEvents = recordEvents.slice(0, listLength - noRecordEvents.length)
  }

  let currentEvent;

  let combinedEvents = [...recordEvents, ...noRecordEvents]

  if (req.query.eventId !== null) {


    // Using (==) operator here, as even._id and req.query.eventId are different types, and that is not important for the comparison.
    const doesExist = combinedEvents.some(event => event._id == req.query.eventId)
    if (!doesExist) {
      currentEvent = allEvents.filter(event => event._id == req.query.eventId)
      combinedEvents = [...combinedEvents, ...currentEvent]
    }
  }

  let events = combinedEvents.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return (dateA > dateB) ? -1 : 1
  })

  res.json(events)
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