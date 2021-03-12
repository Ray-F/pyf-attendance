import {
  deleteAllAttendanceFromDb, deleteAllEventsFromDb, deleteAttendanceFromDb, deleteEventFromDb, getEventFromDb,
  getEventsFromDb, saveEventToDb,
} from '../models/mongodb/MongoRepository';
import Event from '../models/Event';

/**
 * Gets all events or a single event if an `eventId` is passed.
 *
 * @param {string} [req.query.eventId] - The ID of the event to return.
 */
const getEvents = async (req, res, next) => {
  const events = req.query.eventId
    ? (await getEventFromDb(req.query.eventId)).toDto() : (await getEventsFromDb()).map((event) => event.toDto());
  return res.json(events);
};

/**
 * Returns an array of JSON objects of a given length, filled first by all events that still need submitting, with the
 * rest being filled with the most recent events ordered by ascending date.
 *
 * @param {number} [req.query.listLength] - Size of the number of events to return (default 10).
 */
const getEventDashboardList = async (req, res, next) => {
  // Check if an array length number has been defined and store that value, otherwise default the value to 10
  let listLength = req.query.listLength ? req.query.listLength : 10;

  // Find and store all events from the collection
  let allEvents = await getEventsFromDb();

  // Find and store all events where attendance records still need to be submitted and sort these by date
  // We sort these by date is so that when taking the first 10 events, these are the most recent events
  let noRecordEvents = allEvents
    .filter(event => !event.hasAttendanceRecords)
    .sort((a, b) => a.date > b.date ? -1 : 1);

  // Find and store all events that have attendance records and sort these by date
  let recordEvents = allEvents
    .filter(event => event.hasAttendanceRecords)
    .sort((a, b) => a.date > b.date ? -1 : 1);

  let combinedEvents = [...noRecordEvents, ...recordEvents].slice(0, listLength);

  if (req.query.eventId) {
    // Check if the requested eventId exists inside the current list of events, and if not, add the event
    const doesExist = combinedEvents.some(event => event.id === req.query.eventId);
    if (!doesExist) {
      let currentEvent = allEvents.find(event => event.id === req.query.eventId);
      if (currentEvent) {
        combinedEvents.push(currentEvent);
      }
    }
  }

  const sortedEvents = combinedEvents
    .sort((a, b) => a.date > b.date ? -1 : 1)
    .map((event) => event.toDto());
  res.json(sortedEvents);
};

/**
 * Saves an event.
 *
 * @param {string} [req.body._id] - The ID of the event to save (if applicable).
 * @param {string} [req.body.title] - The title of the event.
 * @param {string} req.body.type - The type of event.
 * @param {string} req.body.date - The date of the event.
 * @param {boolean} req.body.hasAttendanceRecords - If the event has existing attendance records.
 */
const saveEvent = async (req, res, next) => {
  await saveEventToDb(new Event(req.body));
  res.sendStatus(200);
};

/**
 * Deletes the specified event along with their associated attendance records.
 *
 * @param {string} req.query.eventId - The ID of the event to delete.
 */
const deleteEvent = async (req, res, next) => {
  let eventId = req.query.eventId;

  if (eventId) {
    const deleteResult = await deleteEventFromDb(eventId);
    const deleteAttendanceResult = await deleteAttendanceFromDb(eventId);

    res.status(200).send(
      `Delete successful: ${deleteResult.result.n} event(s) and ${deleteAttendanceResult.result.n} attendance record(s) were wiped.`);
  } else {
    res.status(404).send('No event Id specified! No records deleted');
  }
};

/**
 * Deletes all events along with their associated attendance records.
 */
const resetEvents = async (req, res, next) => {
  const deleteResult = await deleteAllEventsFromDb();
  const deleteAttendanceResult = await deleteAllAttendanceFromDb();

  res.status(200).send(`Delete successful: ${deleteResult.result.n} events and ${deleteAttendanceResult.result.n} attendance records were wiped.`);
};


export {
  getEvents,
  saveEvent,
  deleteEvent,
  resetEvents,
  getEventDashboardList,
};
