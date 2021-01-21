const { saveEventToDb, getEventsFromDb } = require("../models/mongodb/MongoRepository");


const getEvents = async (req, res, next) => {
  const events = await getEventsFromDb()
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
  eventObject.hasAttendanceRecords = false
  eventObject.date = new Date(eventObject.date)

  await saveEventToDb(eventObject)
  res.sendStatus(200)
}


module.exports = {
  getEvents, getRecentEvents, saveEvent
}